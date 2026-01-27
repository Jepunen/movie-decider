import { updateSessionData, getSessionData } from "@/redis/redis";
import { redisData } from "@/types/redisData";
import { CustomMovie, Result } from "@/types/movies";

type requestBody = {
  sessionID: string;
  CustomMovie: CustomMovie;
  score: string;
};

// Helper to calculate results from session data
function calculateResults(sessionData: redisData): Result[] {
  const results: Result[] = [];

  for (const imdbId in sessionData.movies) {
    const movieEntry = sessionData.movies[imdbId];
    results.push({
      movie: movieEntry.movieData,
      compatibility: Math.round(movieEntry.score * 20), // Convert 1-5 to 20-100
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
        { status: 404 }
      );
    }

    // Update movie scores
    const currentMovieData = sessionData.movies[movie.imdb_id];
    if (!currentMovieData) {
      sessionData.movies[movie.imdb_id] = {
        movieData: movie,
        score: userScore,
        count: 1,
      };
    } else {
      const totalScore = currentMovieData.score * currentMovieData.count + userScore;
      const newCount = currentMovieData.count + 1;
      sessionData.movies[movie.imdb_id] = {
        movieData: movie,
        score: totalScore / newCount,
        count: newCount,
      };
    }

    // Calculate updated results
    const results = calculateResults(sessionData);
    sessionData.results = results; // Store results in session

    // Save updated data back to Redis (this publishes to all subscribers)
    await updateSessionData(sessionID, sessionData);

    return Response.json(
      { 
        message: "Vote submitted successfully",
        results 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return Response.json(
      { message: "Error submitting vote" },
      { status: 500 }
    );
  }
}
