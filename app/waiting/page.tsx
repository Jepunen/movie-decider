"use client";

import WaitingPage from "@/app/components/_components/_pages/WaitingPage";
import { useSession } from "@/app/context/SessionContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Loading from "@/app/components/Loading";

function WaitingContent() {
    const { roomCode, playerCount, joinSession, sessionState } = useSession();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const router = useRouter();

    useEffect(() => {
        if (code && (!roomCode || roomCode !== code)) {
            joinSession(code);
        }
    }, [code, roomCode, joinSession]);

    // Check for game start
    useEffect(() => {
        if (sessionState) {
            router.push(`/vote?code=${roomCode}`);
        }
    }, [sessionState, roomCode, router]);

    const handleNavigate = (screen: string, code?: string) => {
        if (screen === "home") router.push("/");
        else if (screen === "join") router.push("/join"); // Back button goes to join?
        else router.push(`/${screen}?code=${code || roomCode}`);
    };

    return (
        <WaitingPage
            onNavigate={handleNavigate}
            roomCode={code || roomCode || ""}
            playerCount={playerCount}
        />
    );
}

export default function Waiting() {
    return (
        <Suspense fallback={<Loading />}>
            <WaitingContent />
        </Suspense>
    );
}
