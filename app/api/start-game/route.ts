import { getSessionData, updateSessionData } from "@/redis/redis";
import { CustomMovie } from "@/types/movies";
import { redisTournamentData } from "@/types/redisData";
import Redis from "ioredis";
import { getMovies } from "@/lib/movies";
import { pickTournamentMovies, buildPairs } from "@/lib/tournament";
import { mergeGenres, mergeYearRanges, buildMovieParams } from "@/lib/filter";

type RequestBody = {
    sessionID: string;
    movies: CustomMovie[];
    hostGenres: number[];
    hostYearRange?: [number, number];
    gameMode?: "classic" | "tournament";
    playerCount?: number;
};

export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();
        const { sessionID, movies, hostGenres, hostYearRange, gameMode = "classic", playerCount = 1 } = body;

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

        const guestGenreSets = guestGenreValues.flatMap((v) =>
            v ? [JSON.parse(v) as number[]] : [],
        );
        const mergedGenres = mergeGenres(hostGenres, guestGenreSets);

        const allYearRanges: [number, number][] = [
            ...(hostYearRange ? [hostYearRange] : []),
            ...guestYearRangeValues.flatMap((v) => (v ? [JSON.parse(v) as [number, number]] : [])),
        ];
        const mergedYearRange = mergeYearRanges(allYearRanges);
        const movieParams = buildMovieParams(mergedGenres, mergedYearRange);

        let finalMovies = movies;
        if (Object.keys(movieParams).length > 0) {
            finalMovies = await getMovies(movieParams);
        }

        // ── Tournament setup ──────────────────────────────────────────────
        if (gameMode === "tournament") {
            const tournamentMovies = pickTournamentMovies(finalMovies);

            if (tournamentMovies.length < 2) {
                return Response.json({ message: "Not enough movies for a tournament" }, { status: 400 });
            }

            const pairs = buildPairs(tournamentMovies);

            const tournamentData: redisTournamentData = {
                status: "voting",
                roundIndex: 0,
                pairs,
                playerCount,
                allMovies: tournamentMovies,
                eliminatedMovies: [],
            };

            sessionData.sessionState = true;
            sessionData.gameMode = "tournament";
            sessionData.currentMovies = tournamentMovies;
            sessionData.tournament = tournamentData;

            await updateSessionData(sessionID, sessionData);

            return Response.json({ message: "Tournament started successfully" }, { status: 200 });
        }

        // ── Classic mode ──────────────────────────────────────────────────
        sessionData.sessionState = true;
        sessionData.gameMode = "classic";
        sessionData.currentMovies = finalMovies;

        await updateSessionData(sessionID, sessionData);

        console.log("🎬 Movie params:", movieParams);

        return Response.json({ message: "Game started successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error starting game:", error);
        return Response.json({ message: "Failed to start game" }, { status: 500 });
    }
}
