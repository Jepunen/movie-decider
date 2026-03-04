import { updateSessionData, getSessionData } from "@/redis/redis";
import { redisData } from "@/types/redisData";
import { CustomMovie, Result } from "@/types/movies";

type requestBody = {
	sessionID: string;
	CustomMovie: CustomMovie;
	score: string;
};

// Maps raw vote (2–5) to a 0–100 transformed value.
// A vote of 1 is a veto and is handled separately — do not pass 1 here.
function transformVote(raw: number): number {
	const map: Record<number, number> = { 2: 25, 3: 50, 4: 75, 5: 100 };
	return map[raw] ?? 50;
}

// Calculates the veto-penalised compatibility score (0–100) for a single movie entry.
function compatibilityScore(score: number, count: number, vetoes: number): number {
	const total = count + vetoes;
	if (total === 0) return 0;
	if (count === 0) return 0; // all votes were vetoes
	const vetoFactor = Math.pow(count / total, 3.5);
	return Math.round(Math.min(100, Math.max(0, score * vetoFactor)));
}

// Helper to calculate results from session data
function calculateResults(sessionData: redisData): Result[] {
	const results: Result[] = [];

	for (const imdbId in sessionData.movies) {
		const movieEntry = sessionData.movies[imdbId];
		results.push({
			movie: movieEntry.movieData,
			compatibility: compatibilityScore(
				movieEntry.score,
				movieEntry.count,
				movieEntry.vetoes ?? 0,
			),
		});
	}

	// Sort by compatibility score (highest first)
	results.sort((a, b) => b.compatibility - a.compatibility);

	return results;
}

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
