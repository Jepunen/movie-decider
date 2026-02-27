"use client";

import ResultsPage from "@/app/components/_components/_pages/ResultPage";
import { useSession } from "@/app/context/SessionContext";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Loading from "@/app/components/Loading";

function ResultsContent() {
    const { results, joinSession, roomCode, isConnected } = useSession();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    useEffect(() => {
        if (code && (!roomCode || roomCode !== code)) {
            joinSession(code);
        }
    }, [code, roomCode, joinSession]);

    // If we have results, show them. 
    // If not, and we are connected, maybe we are still waiting for them or game not finished?
    // But this page is likely navigated to when results are ready.
    // If refreshed, joinSession -> server sends results in session-update.

    if (!results || results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-xl">Waiting for results...</p>
                <Loading />
            </div>
        );
    }

    return (
        <ResultsPage
            results={results}
        />
    );
}

export default function Results() {
    return (
        <Suspense fallback={<Loading />}>
            <ResultsContent />
        </Suspense>
    );
}
