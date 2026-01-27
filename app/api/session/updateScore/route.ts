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

		// check if updated movie has a score
		const currentMovieData = sessionData.movies[movie.imdb_id];
		if (!currentMovieData) {
			// New movie, initialize with score and count of 1
			sessionData.movies[movie.imdb_id] = {
				movieData: movie,
				score: userScore,
				count: 1,
			};
		} else {
			// Existing movie, calculate new average score
			const totalScore =
				currentMovieData.score * currentMovieData.count + userScore;
			const newCount = currentMovieData.count + 1;
			sessionData.movies[movie.imdb_id] = {
				movieData: movie,
				score: totalScore / newCount,
				count: newCount,
			};
		}
		// Save updated data back to Redis
		await updateSessionData(sessionID, sessionData);

		return Response.json({ data: sessionData.movies }, { status: 200 });
	} catch (error: any) {
		////console.log(error)
		return Response.json({ message: "error" }, { status: 500 });
	}
}
