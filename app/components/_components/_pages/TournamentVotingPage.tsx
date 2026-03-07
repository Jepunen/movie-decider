"use client";

import { useState } from "react";
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
    /** Called when tournament is complete to navigate away */
    onNavigate: (screen: Screen, code?: string) => void;
}

// ─── API call ───────────────────────────────────────────────────────
// BACKEND DEV: Create POST /api/tournament/vote
// - Accepts TournamentVoteRequest body
// - Records this user's pick for the given pair in the current round
// - When ALL users have voted on ALL pairs in the round:
//     1. Tally votes per pair — movie with more "yes" picks wins
//     2. Build next round pairs from winners (or final rankings)
//     3. Publish updated TournamentState via session-update socket event
//        with status "voting" (next round) or "complete" (tournament over)
// - While some users are still voting, the users who finished get
//   status "waiting" in their socket update so the UI shows the
//   between-round waiting screen.

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
    onNavigate,
}: TournamentVotingPageProps) {
    const [pairIndex, setPairIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const roundLabel = getRoundLabel(roundIndex);
    const totalPairs = pairs.length;
    const currentPair = pairs[pairIndex] as TournamentPair | undefined;
    const leftMovie = currentPair?.[0];
    const rightMovie = currentPair?.[1];

    // All pairs in current round voted on by this user → waiting for others
    const finishedCurrentRound = pairIndex >= totalPairs;

    // ── Handle user pick ────────────────────────────────────────────
    const handlePick = async (winner: CustomMovie) => {
        if (!leftMovie || !rightMovie || isSubmitting) return;

        setIsSubmitting(true);

        const success = await submitTournamentVote({
            sessionID: roomCode,
            roundIndex,
            pairIndex,
            winnerImdbId: winner.imdb_id,
        });

        setIsSubmitting(false);

        if (!success) {
            // TODO: Show toast / error feedback
            return;
        }

        // Move to next pair (or finish round)
        setPairIndex((prev) => prev + 1);
    };

    // ── When backend pushes a new round, reset local pair index ─────
    // The route wrapper should re-render this component with new props
    // when roundIndex changes. We reset pairIndex via key prop on the
    // parent (see note below) OR with an effect:
    //
    // ROUTE WRAPPER NOTE: render <TournamentVotingPage key={roundIndex} .../>
    // so React remounts and resets local state when a new round starts.

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

    // ── Render: tournament complete → navigate to results ───────────
    if (status === "complete") {
        // Navigation is triggered; results page reads rankings from context
        onNavigate("results", roomCode);
        return null;
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
            <div className="grid grid-cols-2 gap-3 w-full items-stretch auto-rows-fr">
                {leftMovie && rightMovie && (
                    <>
                        <TournamentMovieCard
                            movie={leftMovie}
                            onPick={() => handlePick(leftMovie)}
                            disabled={isSubmitting}
                        />
                        <TournamentMovieCard
                            movie={rightMovie}
                            onPick={() => handlePick(rightMovie)}
                            disabled={isSubmitting}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
