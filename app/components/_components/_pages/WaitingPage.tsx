import { useState, useEffect } from "react";
import Header from "../_ui/Header";
import StatusImage from "../StatusImage";
import PillButtonGroup from "../PillButtonGroup";
import GenreSelector from "../GenreSelector";
import type { Screen } from "@/types/screen";
import YearRangeSelector from "../YearRangeSelector";
import { socket } from "@/app/socket";

interface JoinPageProps {
	onNavigate: (screen: Screen, code?: string) => void;
	roomCode: string;
	playerCount: number;
	sessionJoined: boolean;
}

export default function WaitingPage({ onNavigate, roomCode, playerCount, sessionJoined }: JoinPageProps) {
	const [selected, setSelected] = useState("waiting");
	const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
	const [yearRange, setYearRange] = useState<[number, number]>([2000, new Date().getFullYear()]);


	useEffect(() => {
		if (!sessionJoined) return;
		/* console.log("Emitting guest-genres", { 
			sessionID: roomCode, 
			genres: selectedGenres,
			socketId: socket.id,
			socketConnected: socket.connected
		}); */
		socket.emit("guest-genres", {
			sessionID: roomCode,
			genres: selectedGenres,
		});
	}, [selectedGenres, roomCode, sessionJoined]);


	// Removed duplicate session-update listener - handled in page.tsx

	return (
		<div className="relative flex flex-col min-h-[calc(100dvh-2rem)] w-full max-w-screen-sm items-center gap-6 pb-6">
			<div className="pt-0.5">
				<Header />
			</div>

			<div className="flex items-center gap-2 text-accent">
				<span className="text-2xl">👥</span>
				<span className="text-xl font-semibold">{playerCount} {playerCount === 1 ? 'player' : 'players'}</span>
			</div>

			<div className="text-center mt-6 text-2xl font-medium text-foreground px-4">
				{selected === "waiting" && (
					<p>Wait for host to start the game!</p>
				)}
				{selected === "preferences" && (
					<p>Set your movie preferences!</p>
				)}
			</div>

			<div className="flex-1 flex items-center justify-center w-full px-2">
				{selected === "waiting" && <StatusImage status="waiting" />}
			</div>

			{selected === "preferences" && (
				<div className="flex flex-col items-center gap-2 w-full px-2">

					<h3 className="text-xl font-semibold text-foreground">
						Select Year Range
					</h3>
					<YearRangeSelector
						init_value={yearRange}
						onChange={setYearRange}
					/>

					<h3 className="text-2xl font-semibold text-foreground">
						Select Genres
					</h3>
					<GenreSelector
						onChange={setSelectedGenres}
						selected={selectedGenres}
					/>
				</div>
			)}

			<div className="flex flex-col w-full px-1">
				<PillButtonGroup
					options={[
						{ label: "Waiting Room", value: "waiting" },
						{ label: "Preferences", value: "preferences" },
					]}
					value={selected}
					onChange={setSelected}
					className="w-full justify-center"
				/>
			</div>
		</div>
	);
}
