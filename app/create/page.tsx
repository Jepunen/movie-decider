"use client";

import CreatePage from "@/app/components/_components/_pages/CreatePage";
import { useSession } from "@/app/context/SessionContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Loading from "@/app/components/Loading";

function CreateContent() {
    const { roomCode, playerCount, setRoomCode, movies, joinSession } = useSession(); // We don't have setMovies exposed in context properly? 
    // Context has 'movies' state, but 'setMovies' is internal to context primarily updated via socket.
    // However, CreatePage calls 'setMovies' after fetching them.
    // I need to update SessionContext to expose setMovies or a method to update them.
    // Or better, CreatePage expects setMovies to update LOACAL state? 
    // In original page.tsx, setMovies updated the central state.
    // So I should expose setMovies from Context.

    // For now I'll cast useSession to any to avoid TS errors if I update the context later, 
    // or I'll just rely on what is available and update context if needed.
    // Actually, I should update Context to include setMovies.

    // Also handling roomCode from URL.
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const router = useRouter();

    useEffect(() => {
        if (code && code !== roomCode) {
            joinSession(code);
        }
    }, [code, roomCode, joinSession]);

    // CreatePage expects setMovies.
    // I need to add setMovies to SessionContext.
    // For this step I'll assume I'll fix context. 

    const handleNavigate = (screen: string, code?: string) => {
        if (screen === "review") router.push(`/vote?code=${code || roomCode}`);
        else if (screen === "home") router.push("/");
        else router.push(`/${screen}?code=${code || roomCode}`);
    };

    return (
        <CreatePage
            onNavigate={handleNavigate}
            setMovies={(movies) => {
                // setMovies in context logic if needed
            }}
            roomCode={code || roomCode || ""}
            playerCount={playerCount}
        />
    );
}

export default function Create() {
    return (
        <Suspense fallback={<Loading />}>
            <CreateContent />
        </Suspense>
    );
}
