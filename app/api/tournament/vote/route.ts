import { getSessionData, updateSessionData } from "@/redis/redis";
import { redisTournamentData } from "@/types/redisData";
import { TournamentVoteRequest } from "@/types/tournament";
import { CustomMovie } from "@/types/movies";
import { resolvePair, buildPairs, computeRankings, rankingsToResults } from "@/lib/tournament";
import Redis from "ioredis";

// ─── Route handler ───────────────────────────────────────────────────

export async function POST(request: Request) {
    try {
        const body: TournamentVoteRequest = await request.json();
        const { sessionID, roundIndex, pairIndex, winnerImdbId, voterSocketId } = body;

        if (!sessionID || winnerImdbId === undefined || pairIndex === undefined || roundIndex === undefined || !voterSocketId) {
            return Response.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // ── Load session ─────────────────────────────────────────────────
        const sessionData = await getSessionData(sessionID);
        if (!sessionData) {
            return Response.json({ success: false, message: "Session not found" }, { status: 404 });
        }

        const tournament: redisTournamentData | undefined = sessionData.tournament;
        if (!tournament) {
            return Response.json({ success: false, message: "No tournament in progress" }, { status: 400 });
        }

        if (tournament.roundIndex !== roundIndex) {
            return Response.json({ success: false, message: "Round mismatch" }, { status: 409 });
        }

        if (pairIndex < 0 || pairIndex >= tournament.pairs.length) {
            return Response.json({ success: false, message: "Invalid pair index" }, { status: 400 });
        }

        // ── Record vote (deduplicated per socket per pair) ────────────────
        const redis = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
        });

        const voteKey = `tournament:${sessionID}:round:${roundIndex}:votes`;
        const field = `${pairIndex}:${voterSocketId}`;

        // HSETNX returns 1 if newly set, 0 if already existed → prevents double-voting
        const wasSet = await redis.hsetnx(voteKey, field, winnerImdbId);
        await redis.expire(voteKey, 3600);

        if (!wasSet) {
            await redis.disconnect();
            return Response.json({ success: false, message: "Already voted for this pair" }, { status: 409 });
        }

        // ── Check whether all pairs in this round are fully voted ─────────
        const allVotes = await redis.hgetall(voteKey);
        await redis.disconnect();

        const { pairs, playerCount, eliminatedMovies } = tournament;
        const pairsCount = pairs.length;

        let allPairsComplete = true;
        for (let i = 0; i < pairsCount; i++) {
            const votesForPair = Object.keys(allVotes).filter((k) => k.startsWith(`${i}:`)).length;
            if (votesForPair < playerCount) {
                allPairsComplete = false;
                break;
            }
        }

        if (!allPairsComplete) {
            // Still waiting for other players — nothing else to do
            return Response.json({ success: true }, { status: 200 });
        }

        // ── Advance the tournament ────────────────────────────────────────
        const winners: CustomMovie[] = [];
        const newEliminated = [...eliminatedMovies];

        for (let i = 0; i < pairsCount; i++) {
            const [movieA, movieB] = pairs[i];
            const pairVotes: Record<string, string> = {};
            for (const [k, v] of Object.entries(allVotes)) {
                if (k.startsWith(`${i}:`)) pairVotes[k] = v;
            }
            const { winner, loser, loserVotes } = resolvePair(pairVotes, movieA, movieB);
            winners.push(winner);
            newEliminated.push({ movie: loser, roundIndex, votesReceived: loserVotes });
        }

        const isLastRound = roundIndex >= 2 || winners.length <= 1;

        if (isLastRound) {
            // Tournament complete
            const champion = winners[0];
            const rankings = computeRankings(newEliminated, champion, roundIndex + 1);
            const results = rankingsToResults(rankings);

            sessionData.tournament = {
                ...tournament,
                status: "complete",
                roundIndex: roundIndex + 1,
                pairs: [],
                eliminatedMovies: newEliminated,
                rankings,
            };
            sessionData.results = results;

            await updateSessionData(sessionID, sessionData);
        } else {
            // Next round
            const nextPairs = buildPairs(winners);

            sessionData.tournament = {
                ...tournament,
                status: "voting",
                roundIndex: roundIndex + 1,
                pairs: nextPairs,
                eliminatedMovies: newEliminated,
            };

            await updateSessionData(sessionID, sessionData);
        }

        return Response.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Tournament vote error:", error);
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
