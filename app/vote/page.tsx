"use client";

import VotingPage from "@/app/components/_components/_pages/VotingPage";
import { useSession } from "@/app/context/SessionContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Loading from "@/app/components/Loading";

function VoteContent() {
    const { roomCode, movies, joinSession } = useSession();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const router = useRouter();

    useEffect(() => {
        if (code && (!roomCode || roomCode !== code)) {
            joinSession(code);
        }
    }, [code, roomCode, joinSession]);

    const handleNavigate = (screen: string, code?: string) => {
        if (screen === "results") router.push(`/results?code=${code || roomCode}`);
        else if (screen === "home") router.push("/");
        else router.push(`/${screen}?code=${code || roomCode}`);
    };

    return (
        <VotingPage
            movies={movies}
            setResults={() => { }} // Dummy function, results update via socket or parent
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
