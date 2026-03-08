import { updateSessionData, getSessionData } from "@/redis/redis";
import { redisData } from "@/types/redisData";
import { CustomMovie } from "@/types/movies";
import { transformVote, compatibilityScore, calculateResults } from "@/lib/scoring";

type requestBody = {
	sessionID: string;
	CustomMovie: CustomMovie;
	score: string;
};

export async function POST(req: Request) {
	try {
		const body: requestBody = await req.json();

		const sessionID: string = body.sessionID;
		const movie: CustomMovie = body.CustomMovie;
		const userScore: number = Number(body.score);

		// Fetch current session data from Redis
		const sessionData: redisData = await getSessionData(sessionID);
		if (!sessionData) {
			return Response.json(
				{ message: "Session not found" },
				{ status: 404 },
			);
		}

		// Update movie scores
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

		// Calculate updated results
		const results = calculateResults(sessionData);
		sessionData.results = results; // Store results in session

		// Save updated data back to Redis (this publishes to all subscribers)
		await updateSessionData(sessionID, sessionData);

		return Response.json(
			{
				message: "Vote submitted successfully",
				results,
			},
			{ status: 200 },
		);
	} catch (error: any) {
		////console.log(error);
		return Response.json(
			{ message: "Error submitting vote" },
			{ status: 500 },
		);
	}
}
