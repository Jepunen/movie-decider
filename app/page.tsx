"use client";

import { useSession } from "./context/SessionContext";
import HomePage from "./components/_components/_pages/HomePage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const { createSession, roomCode } = useSession();
	const router = useRouter();



	const handleNavigate = (screen: string, code?: string) => {
		if (code) {
			if (screen === "create") router.push(`/create?code=${code}`);
			else if (screen === "join") router.push(`/join`); // Join page handles input
			else router.push(`/${screen}?code=${code}`);
		} else {
			router.push(`/${screen}`);
		}
	};

	const handleCreateRoom = async () => {
		const code = await createSession();
		if (code) {
			console.log("Created session, navigating to:", `/create?code=${code}`);
			router.push(`/create?code=${code}`);
		}
	};

	// Better: HomePage component calls onNavigate.
	// I can pass a handler that calls createSession then router.push.

	return (
		<main className="min-h-dvh flex flex-col items-center justify-center p-4 overflow-hidden">
			<HomePage
				onNavigate={handleNavigate}
				onCreateRoom={handleCreateRoom} // HomePage calls this then onNavigate... wait HomePage logic is specific.
			/>
		</main>
	);
}
