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
	onJoinRoom: (code: string) => Promise<void>;
}

export default function JoinPage({ onNavigate, onJoinRoom }: JoinPageProps) {
	const [guestCode, setGuestCode] = useState("");

	const handleJoin = async () => {
		if (guestCode.length === 6) {
			await onJoinRoom(guestCode);
		}
	};

	return (
		<div className="relative flex flex-col min-h-[calc(100dvh-2rem)] w-full max-w-screen-sm items-center gap-6 pb-6">
			<BackButton onClick={() => onNavigate("home")} />

			<div className="pt-10">
				<Header />
			</div>

			<div className="flex-1 flex items-center justify-center w-full px-2">
				<StatusImage status="joining" />
			</div>

			<div className="flex flex-col items-center gap-2 w-full">
				<h2 className="text-4xl font-black text-center text-gradient">Room Code</h2>
				<RoomCode isHost={false} code={guestCode} onCodeChange={(code) => setGuestCode(code)} />
			</div>

			<div className="flex flex-col gap-9 w-full mt-12">
				<Button onClick={handleJoin}>Join Game</Button>
			</div>
		</div>
	);
}
