import { escape } from "querystring";
import { updateSessionData, getSessionData } from "@/redis/redis";
import { redisData } from "@/types/redisData";
import { CustomMovie } from "@/types/movies";

// Structure of expected request body
type requestBody = {
	sessionID: string;
	CustomMovie: CustomMovie;
	score: string;
};

export async function POST(req: Request) {
	try {
		// Extraxt reques data
		const body: requestBody = await req.json();

		const sessionID: string = body.sessionID;
		const movie: CustomMovie = body.CustomMovie; // CustomMovie type data of movie
		const userScore: number = Number(body.score);

		// fetch current session data from redis
		const sessionData: redisData = await getSessionData(sessionID);
		if (!sessionData) {
			return Response.json(
				{ Message: "Session not found" },
				{ status: 404 },
			);
		}

		// Map raw vote (2–5) to a 0–100 transformed value.
		function transformVote(raw: number): number {
			const map: Record<number, number> = { 2: 25, 3: 50, 4: 75, 5: 100 };
			return map[raw] ?? 50;
		}

		// check if updated movie has a score
		const currentMovieData = sessionData.movies[movie.imdb_id];
		const isVeto = userScore === 1;

		if (!currentMovieData) {
			sessionData.movies[movie.imdb_id] = {
				movieData: movie,
				score: isVeto ? 0 : transformVote(userScore),
				count: isVeto ? 0 : 1,
				vetoes: isVeto ? 1 : 0,
			};
		} else {
			const currentVetoes = currentMovieData.vetoes ?? 0;
			if (isVeto) {
				sessionData.movies[movie.imdb_id] = {
					...currentMovieData,
					vetoes: currentVetoes + 1,
				};
			} else {
				const transformed = transformVote(userScore);
				const totalScore = currentMovieData.score * currentMovieData.count + transformed;
				const newCount = currentMovieData.count + 1;
				sessionData.movies[movie.imdb_id] = {
					...currentMovieData,
					score: totalScore / newCount,
					count: newCount,
				};
			}
		}
		// Save updated data back to Redis
		await updateSessionData(sessionID, sessionData);

		return Response.json({ data: sessionData.movies }, { status: 200 });
	} catch (error: any) {
		////console.log(error)
		return Response.json({ message: "error" }, { status: 500 });
	}
}
