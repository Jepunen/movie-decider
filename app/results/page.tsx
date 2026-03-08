"use client";

import ResultsPage from "@/app/components/_components/_pages/ResultPage";
import TournamentResultPage from "@/app/components/_components/_pages/TournamentResultPage";
import { useSession } from "@/app/context/SessionContext";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Loading from "@/app/components/Loading";

function ResultsContent() {
    const { results, joinSession, roomCode, gameMode, tournamentState } = useSession();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    useEffect(() => {
        if (code && (!roomCode || roomCode !== code)) {
            joinSession(code);
        }
    }, [code, roomCode, joinSession]);

    // ── Tournament results ────────────────────────────────────────────
    if (gameMode === "tournament") {
        if (!tournamentState?.rankings || tournamentState.rankings.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <p className="text-xl">Waiting for results...</p>
                    <Loading />
                </div>
            );
        }
        return <TournamentResultPage rankings={tournamentState.rankings} />;
    }

    // ── Classic results ───────────────────────────────────────────────
    if (!results || results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-xl">Waiting for results...</p>
                <Loading />
            </div>
        );
    }

    return <ResultsPage results={results} />;
}

export default function Results() {
    return (
        <Suspense fallback={<Loading />}>
            <ResultsContent />
        </Suspense>
    );
}
