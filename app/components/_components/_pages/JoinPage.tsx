import React, { useState } from "react";
import Header from "../_ui/Header";
import StatusImage from "../StatusImage";
import Button from "../Button";
import RoomCode from "../RoomCode";
import type { Screen } from "@/types/screen";
import BackButton from "../BackButton";
import { useMutation } from "@tanstack/react-query";

interface JoinPageProps {
	onNavigate: (screen: Screen, code?: string) => void;
}

const joinRoom = async (guestCode: string) => {
	const res = await fetch("/api/session/join", {
		method: "POST",
		body: JSON.stringify({ sessionID: guestCode }),
	});

	return res.json();
};

export default function JoinPage({ onNavigate }: JoinPageProps) {
	const [guestCode, setGuestCode] = useState("");

	const joinRoomMutation = useMutation({
		mutationFn: joinRoom,
		onSuccess: (data) => {
			console.log("Join room response data:", data);

			if (data.sessionID === undefined) {
				onNavigate("home");
				return;
			}

			onNavigate("waiting", data.sessionID.toString());
		},
		onError: (error) => {
			console.error("Error joining room:", error);
			// Optionally, you can add user feedback here
			onNavigate("home");
		},
	});

	const handleJoinGame = async () => {
		joinRoomMutation.mutate(guestCode);
	};

	return (
		// min-h-[calc(100vh-2rem)] accounts for the p-4 padding in page.tsx
		<div className="flex flex-col items-center justify-between min-h-[calc(100vh-2rem)] w-full">
			<BackButton onClick={() => onNavigate("home")} />

			<div className="mt-8">
				<Header />
			</div>

			<div className="flex-1 flex items-center justify-center w-full">
				<StatusImage status="joining" />
			</div>

			<div className="flex flex-col items-center gap-2 w-full">
				<h2 className="text-4xl text-text font-black text-center">
					Room Code
				</h2>
				<RoomCode
					isHost={false}
					code={guestCode}
					onCodeChange={(code) => setGuestCode(code)}
				/>
			</div>

			<div className="flex flex-col gap-9 w-full mt-12">
				<Button onClick={handleJoinGame}>Join Game</Button>
			</div>
		</div>
	);
}
