"use client";

import JoinPage from "@/app/components/_components/_pages/JoinPage";
import { useSession } from "@/app/context/SessionContext";
import { useRouter } from "next/navigation";

export default function Join() {
    const { joinSession } = useSession();
    const router = useRouter();

    const handleNavigate = (screen: string, code?: string) => {
        if (screen === "home") router.push("/");
        else if (code) router.push(`/${screen}?code=${code}`);
        else router.push(`/${screen}`);
    };

    const handleJoinRoom = async (code: string) => {
        joinSession(code);
        // Navigate to waiting room
        router.push(`/waiting?code=${code}`);
    };

    return (
        <JoinPage
            onNavigate={handleNavigate}
            onJoinRoom={handleJoinRoom}
        />
    );
}
