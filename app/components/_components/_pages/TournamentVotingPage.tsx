"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "@/app/socket";
import Header from "../_ui/Header";
import type { Screen } from "@/types/screen";
import type { CustomMovie } from "@/types/movies";
import type {
    TournamentPair,
    TournamentRoundLabel,
    TournamentStatus,
    TournamentVoteRequest,
} from "@/types/tournament";
import TournamentMovieCard from "../TournamentMovieCard";
import TournamentRoundWaiting from "@/app/components/_components/TournamentRoundWaiting";

// ─── Helpers ────────────────────────────────────────────────────────

function getRoundLabel(roundIndex: number): TournamentRoundLabel {
    if (roundIndex === 0) return "Quarterfinal";
    if (roundIndex === 1) return "Semifinal";
    return "Final";
}

// ─── Props ──────────────────────────────────────────────────────────
// Route wrapper (app/vote/page.tsx) should provide these from SessionContext.
// `pairs`, `roundIndex`, and `status` come from the TournamentState
// pushed by the backend via the "session-update" socket event.

interface TournamentVotingPageProps {
    /** Session / room code needed for API calls */
    roomCode: string;
    /** Current round pairs delivered by backend via socket */
    pairs: TournamentPair[];
    /** 0-based round index (0 = QF, 1 = SF, 2 = Final) */
    roundIndex: number;
    /** Tournament lifecycle status */
    status: TournamentStatus;
    /** Number of players in the room */
    playerCount: number;
    /** Socket ID of the current user — used server-side to deduplicate votes */
    voterSocketId: string;
    /** Called when tournament is complete to navigate away */
    onNavigate: (screen: Screen, code?: string) => void;
}

// ─── API call ───────────────────────────────────────────────────────

async function submitTournamentVote(payload: TournamentVoteRequest): Promise<boolean> {
    try {
        const res = await fetch("/api/tournament/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return res.ok;
    } catch (err) {
        console.error("Failed to submit tournament vote:", err);
        return false;
    }
}

// ─── Component ──────────────────────────────────────────────────────

export default function TournamentVotingPage({
    roomCode,
    pairs,
    roundIndex,
    status,
    playerCount,
    voterSocketId,
    onNavigate,
}: TournamentVotingPageProps) {
    const [pairIndex, setPairIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const roundLabel = getRoundLabel(roundIndex);
    const totalPairs = pairs.length;
    const currentPair = pairs[pairIndex] as TournamentPair | undefined;
    const leftMovie = currentPair?.[0];
    const rightMovie = currentPair?.[1];

    // All pairs in current round voted on by this user → waiting for others
    const finishedCurrentRound = pairIndex >= totalPairs;

    // ── Handle user pick ────────────────────────────────────────────
    const handlePick = async (winner: CustomMovie) => {
        const liveSocketId = socket.id || voterSocketId;
        if (!leftMovie || !rightMovie || isSubmitting || selectedId || !liveSocketId) return;

        // 1. Show the winner/loser animation for ~700 ms
        setSelectedId(winner.imdb_id);
        setIsSubmitting(true);

        await new Promise((resolve) => setTimeout(resolve, 700));

        const success = await submitTournamentVote({
            sessionID: roomCode,
            roundIndex,
            pairIndex,
            winnerImdbId: winner.imdb_id,
            voterSocketId: liveSocketId,
        });

        if (!success) {
            // TODO: Show toast / error feedback
            setSelectedId(null);
            setIsSubmitting(false);
            return;
        }

        // 2. Brief pause so the exit animation plays, then advance
        await new Promise((resolve) => setTimeout(resolve, 300));
        setSelectedId(null);
        setIsSubmitting(false);
        setPairIndex((prev) => prev + 1);
    };

    // ── Navigate to results when tournament is complete ─────────────
    // Must be a useEffect — status can become "complete" while
    // finishedCurrentRound is also true (waiting screen is showing),
    // so checking in render order would miss it.
    useEffect(() => {
        if (status === "complete") {
            onNavigate("results", roomCode);
        }
    }, [status, onNavigate, roomCode]);

    // ── Render: between-round waiting ───────────────────────────────
    if (status === "waiting" || finishedCurrentRound) {
        return (
            <TournamentRoundWaiting
                roundLabel={roundLabel}
                roundIndex={roundIndex}
                playerCount={playerCount}
            />
        );
    }

    // ── Render: active voting ───────────────────────────────────────
    return (
        <div className="relative flex flex-col min-h-[calc(100dvh-2rem)] w-full max-w-screen-sm mx-auto items-center gap-4 pb-6 px-2">
            <div className="pt-0.5">
                <Header />
            </div>

            {/* Round + pair progress */}
            <div className="w-full rounded-2xl glass-card p-4 flex flex-col gap-1 text-center">
                <p className="text-xs uppercase tracking-wide text-foreground/70">
                    Round {roundIndex + 1}
                </p>
                <p className="text-xl font-bold text-foreground">{roundLabel}</p>
                <p className="text-sm text-foreground/75">
                    Pair {pairIndex + 1} / {totalPairs}
                </p>
            </div>

            {/* 1v1 cards */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={pairIndex}
                    className="grid grid-cols-2 gap-3 w-full items-stretch auto-rows-fr"
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                    {leftMovie && rightMovie && (
                        <>
                            <TournamentMovieCard
                                movie={leftMovie}
                                onPick={() => handlePick(leftMovie)}
                                disabled={isSubmitting}
                                isSelected={selectedId === leftMovie.imdb_id}
                                isEliminated={selectedId !== null && selectedId !== leftMovie.imdb_id}
                            />
                            <TournamentMovieCard
                                movie={rightMovie}
                                onPick={() => handlePick(rightMovie)}
                                disabled={isSubmitting}
                                isSelected={selectedId === rightMovie.imdb_id}
                                isEliminated={selectedId !== null && selectedId !== rightMovie.imdb_id}
                            />
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
