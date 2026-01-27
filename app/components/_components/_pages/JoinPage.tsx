import React, { useState } from "react";
import Header from "../_ui/Header";
import StatusImage from "../StatusImage";
import Button from "../Button";
import RoomCode from "../RoomCode";
import type { Screen } from "@/types/screen";
import BackButton from "../BackButton";

interface JoinPageProps {
	onNavigate: (screen: Screen, code?: string) => void;
}

export default function JoinPage({ onNavigate }: JoinPageProps) {
	const [guestCode, setGuestCode] = useState("");

	return (
		<div className="relative flex flex-col min-h-[calc(100dvh-2rem)] w-full max-w-screen-sm items-center gap-6 pb-6">
			<BackButton onClick={() => onNavigate("home")} />

			<div className="pt-10">
				<Header />
			</div>

			<div className="flex-1 flex items-center justify-center w-full px-2">
				<StatusImage status="joining" />
			</div>

			<div className="flex flex-col items-center gap-2 w-full px-2">
				<h2 className="text-4xl text-text font-black text-center">
					Room Code
				</h2>
				{/* TODO: Implement function to create the room code */}
				<RoomCode
					isHost={false}
					code={guestCode}
					onCodeChange={(code) => setGuestCode(code)}
				/>
			</div>

			<div className="flex flex-col gap-6 w-full px-1">
				<Button
					onClick={() => {
						onNavigate("waiting");
					}}
				>
					Join Game
				</Button>
			</div>
		</div>
	);
}
