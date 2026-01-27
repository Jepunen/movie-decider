"use client";

import { useState, useEffect } from "react";
import Header from "../_ui/Header";
import StatusImage from "../StatusImage";
import Button from "../Button";
import RoomCode from "../RoomCode";
import PillButtonGroup from "../PillButtonGroup";
import type { Screen } from "@/types/screen";
import BackButton from "../BackButton";
import GenreSelector from "../GenreSelector";
import { useMovies } from "@/lib/movies";
import { socket } from "@/app/socket";

interface CreatePageProps {
	onNavigate: (screen: Screen, code?: string) => void;
	setMovies: (movies: any[]) => void;
	roomCode: string;
}

export default function CreatePage({
	onNavigate,
	setMovies,
	roomCode,
}: CreatePageProps) {
	const [selected, setSelected] = useState("create");
	const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
	const [fetchEnabled, setFetchEnabled] = useState(false);

	const {
		data: movies,
		isPending,
		refetch,
	} = useMovies({ with_genres: selectedGenres }, fetchEnabled);

	useEffect(() => {
		// Host also listens for updates (in case of reconnection, etc.)
		const handleSessionUpdate = (data: any) => {
			//console.log("Session update received:", data);

			if (data.sessionState === true) {
				onNavigate("review");
			}
		};

		socket.on("session-update", handleSessionUpdate);

		return () => {
			socket.off("session-update", handleSessionUpdate);
		};
	}, [onNavigate]);

	const handleStartGame = async () => {
		setFetchEnabled(true);
		const res = await refetch();

		if (!res.data) {
			// handle error
			return;
		}

		const movieData = res.data;
		setMovies(movieData);

		// Update session state in Redis - this will trigger WebSocket updates
		const stateRes = await fetch("/api/start-game", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				sessionID: roomCode,
				movies: movieData, // Send movies to be stored in Redis
			}),
		});

		if (stateRes.ok) {
			// Navigation will happen via socket update
			onNavigate("review");
		}
	};

	return (
		<div className="relative flex flex-col min-h-[calc(100dvh-2rem)] w-full max-w-screen-sm items-center gap-5 pb-6">
			<BackButton onClick={() => onNavigate("home")} />

			<div className="pt-10">
				<Header />
			</div>

			<div className="flex-1 flex items-center justify-center w-full px-2">
				{selected !== "preferences" && <StatusImage status="hosting" />}
			</div>

			{selected === "preferences" && (
				<div className="flex flex-col items-center gap-2 w-full mt-2 mb-2">
					<h3 className="text-2xl font-semibold text-text">
						Select Genres
					</h3>
					<GenreSelector
						onChange={setSelectedGenres}
						selected={selectedGenres}
					/>
				</div>
			)}

			<div className="flex flex-col items-center gap-2 w-full mt-2">
				<h2 className="text-4xl text-text font-black text-center">
					Room Code
				</h2>
				{/* TODO: Implement function to create the room code */}
				<RoomCode isHost code={roomCode} />
			</div>

			<div className="flex flex-col gap-6 w-full px-1">
				<Button onClick={handleStartGame}>Start Game</Button>
			</div>

			<div className="flex flex-col w-full px-1">
				<PillButtonGroup
					options={[
						{ label: "Create", value: "create" },
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
