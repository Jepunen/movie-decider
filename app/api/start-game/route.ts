import { getSessionData, updateSessionData } from "@/redis/redis";
import { CustomMovie } from "@/types/movies";
import Redis from "ioredis";
import { getMovies } from "@/lib/movies";

type RequestBody = {
    sessionID: string;
    movies: CustomMovie[];
    hostGenres: number[];
    hostYearRange?: [number, number];
};

export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();
        const { sessionID, movies, hostGenres, hostYearRange } = body;

        if (!sessionID) {
            return Response.json({ message: "sessionID is required" }, { status: 400 });
        }

        // Get current session data
        const sessionData = await getSessionData(sessionID);

        if (!sessionData) {
            return Response.json({ message: "Session not found" }, { status: 404 });
        }

        // Fetch and merge guest genre preferences from Redis
        const redis = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
        });

        const guestGenreKeys = await redis.keys(`session:${sessionID}:genres:*`);
        const guestGenreValues = guestGenreKeys.length ? await redis.mget(...guestGenreKeys) : [];

        const guestYearRangeKeys = await redis.keys(`session:${sessionID}:yearRange:*`);
        const guestYearRangeValues = guestYearRangeKeys.length ? await redis.mget(...guestYearRangeKeys) : [];

        await redis.disconnect();

        const guestGenres = guestGenreValues.flatMap((v) => (v ? (JSON.parse(v) as number[]) : []));
        const mergedGenres = [...new Set([...hostGenres, ...guestGenres])];

        const allYearRanges: [number, number][] = [
            ...(hostYearRange ? [hostYearRange] : []),
            ...guestYearRangeValues.flatMap((v) => (v ? [JSON.parse(v) as [number, number]] : [])),
        ];

        const mergedYearRange: [number, number] | undefined =
            allYearRanges.length > 0
                ? [Math.min(...allYearRanges.map(([start]) => start)), Math.max(...allYearRanges.map(([, end]) => end))]
                : undefined;

        // Build params object combining both genres and year range
        const movieParams: Record<string, string> = {};

        if (mergedGenres.length > 0) {
            movieParams.with_genres = mergedGenres.join("|");
        }
        if (mergedYearRange) {
            movieParams["primary_release_date.gte"] = `${mergedYearRange[0]}-01-01`;
            movieParams["primary_release_date.lte"] = `${mergedYearRange[1]}-12-31`;
        }

        let finalMovies = movies;
        if (Object.keys(movieParams).length > 0) {
            finalMovies = await getMovies(movieParams);
        }

        // Update session with new state and movies
        sessionData.sessionState = true;
        sessionData.currentMovies = finalMovies;

        // This will update Redis AND publish to all subscribers
        await updateSessionData(sessionID, sessionData);

		console.log("🔑 Guest yearRange keys:", guestYearRangeKeys);
		console.log("📦 Guest yearRange values:", guestYearRangeValues);
		console.log("🎯 Merged yearRange:", mergedYearRange);
		console.log("🎬 Movie params:", movieParams);

        return Response.json({ message: "Game started successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error starting game:", error);
        return Response.json({ message: "Failed to start game" }, { status: 500 });
    }
}
