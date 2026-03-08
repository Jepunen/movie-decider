"use client";

import VotingPage from "@/app/components/_components/_pages/VotingPage";
import TournamentVotingPage from "@/app/components/_components/_pages/TournamentVotingPage";
import { useSession } from "@/app/context/SessionContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Loading from "@/app/components/Loading";

function VoteContent() {
    const { roomCode, movies, joinSession, gameMode, tournamentState, playerCount, socketId } = useSession();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const router = useRouter();

    useEffect(() => {
        if (code && (!roomCode || roomCode !== code)) {
            joinSession(code);
        }
    }, [code, roomCode, joinSession]);

    const handleNavigate = (screen: string, navCode?: string) => {
        if (screen === "results") router.push(`/results?code=${navCode || code || roomCode}`);
        else if (screen === "home") router.push("/");
        else router.push(`/${screen}?code=${navCode || code || roomCode}`);
    };

    // ── Tournament mode ──────────────────────────────────────────────
    if (gameMode === "tournament" && tournamentState) {
        return (
            <TournamentVotingPage
                key={tournamentState.roundIndex}
                roomCode={code || roomCode || ""}
                pairs={tournamentState.pairs}
                roundIndex={tournamentState.roundIndex}
                status={tournamentState.status}
                playerCount={playerCount}
                voterSocketId={socketId || ""}
                onNavigate={handleNavigate}
            />
        );
    }

    // ── Classic mode ─────────────────────────────────────────────────
    return (
        <VotingPage
            movies={movies}
            setResults={() => { }}
            onNavigate={handleNavigate}
            roomCode={code || roomCode || ""}
        />
    );
}

export default function Vote() {
    return (
        <Suspense fallback={<Loading />}>
            <VoteContent />
        </Suspense>
    );
}
