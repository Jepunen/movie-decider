import { getSessionData, updateSessionData } from "@/redis/redis";
import { CustomMovie } from "@/types/movies";
import Redis from "ioredis";
import { getMovies } from "@/lib/movies";

type RequestBody = {
  sessionID: string;
  movies: CustomMovie[];
  hostGenres: number[];
};

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { sessionID, movies, hostGenres } = body;

    if (!sessionID) {
      return Response.json(
        { message: "sessionID is required" },
        { status: 400 }
      );
    }

    // Get current session data
    const sessionData = await getSessionData(sessionID);

    if (!sessionData) {
      return Response.json(
        { message: "Session not found" },
        { status: 404 }
      );
    }

    // Fetch and merge guest genre preferences from Redis
    const redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    const guestGenreKeys = await redis.keys(`session:${sessionID}:genres:*`);
    const guestGenreValues = guestGenreKeys.length
      ? await redis.mget(...guestGenreKeys)
      : [];
    await redis.disconnect();

    const guestGenres = guestGenreValues.flatMap((v) =>
      v ? (JSON.parse(v) as number[]) : []
    );
    const mergedGenres = [...new Set([...hostGenres, ...guestGenres])];

	let finalMovies = movies;
	if (mergedGenres.length > 0) {
		finalMovies = await getMovies({ with_genres: mergedGenres.join("|") });
	}

    // Update session with new state and movies
    sessionData.sessionState = true;
    sessionData.currentMovies = finalMovies;

    // This will update Redis AND publish to all subscribers
    await updateSessionData(sessionID, sessionData);

    return Response.json(
      { message: "Game started successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error starting game:", error);
    return Response.json(
      { message: "Failed to start game" },
      { status: 500 }
    );
  }
}
