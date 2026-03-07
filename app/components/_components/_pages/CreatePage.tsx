"use client";

import { useState, useEffect } from "react";
import Header from "../_ui/Header";
import StatusImage from "../StatusImage";
import Button from "../Button";
import RoomCode from "../RoomCode";
import PillButtonGroup from "../PillButtonGroup";
import type { Screen } from "@/types/screen";
import GenreSelector from "../GenreSelector";
import { useMovies } from "@/lib/movies";
import { socket } from "@/app/socket";
import YearRangeSelector from "../YearRangeSelector";

interface CreatePageProps {
	onNavigate: (screen: Screen, code?: string) => void;
	setMovies: (movies: any[]) => void;
	roomCode: string;
	playerCount: number;
}

export default function CreatePage({
	onNavigate,
	setMovies,
	roomCode,
	playerCount
}: CreatePageProps) {
	const [selected, setSelected] = useState("create");
	const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
	const [yearRange, setYearRange] = useState<[number, number]>([2000, new Date().getFullYear()]);
	const [fetchEnabled, setFetchEnabled] = useState(false);
	const [selectedGameMode, setSelectedGameMode] = useState<"classic" | "tournament">("classic");

	const {
		data: movies,
		isPending,
		refetch,
	} = useMovies({ with_genres: selectedGenres, year_range: yearRange }, fetchEnabled);

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
				hostGenres: selectedGenres, // Send host genres for merging with guests
				hostYearRange: yearRange,
				// TODO: Send selected game mode to be stored in Redis and used for game flow (e.g. number of rounds, etc.)
			}),
		});

		if (stateRes.ok) {
			// Navigation will happen via socket update
			onNavigate("review");
		}
	};

	return (
		<div className="relative flex flex-col min-h-[calc(100dvh-2rem)] w-full max-w-screen-sm items-center gap-4 pb-6">
			<div className="pt-0.5">
				<Header />
			</div>

			<div className="flex items-center gap-2 text-accent">
				<span className="text-2xl">👥</span>
				<span className="text-xl font-semibold">{playerCount} {playerCount === 1 ? 'player' : 'players'}</span>
			</div>

			<div className="flex-1 flex items-center justify-center w-full px-2">
				{selected == "create" && <StatusImage status="hosting" />}
			</div>

			{/* Preferences selection */}
			{selected === "preferences" && (
				<div className="flex flex-col items-center gap-2 w-full">


					<h3 className="text-xl font-semibold text-foreground">
						Select Year Range
					</h3>
					<YearRangeSelector
						init_value={yearRange}
						onChange={setYearRange}
					/>
					<h3 className="text-xl font-semibold text-foreground">
						Select Genres
					</h3>
					<GenreSelector
						onChange={setSelectedGenres}
						selected={selectedGenres}
					/>
				</div>
			)}


			{/* Game mode selection */}
			{selected === "gamemode" && (
				<div className="flex flex-col items-center gap-2 w-full">
					<h3 className="text-xl font-semibold text-foreground">
						Select Game Mode
					</h3>

					<div className="w-full max-w-screen-sm px-1 space-y-3">
						<button
							type="button"
							onClick={() => setSelectedGameMode("classic")}
							aria-pressed={selectedGameMode === "classic"}
							className={`w-full rounded-lg border-2 p-4 transition-colors text-left ${selectedGameMode === "classic"
								? "border-primary bg-primary/20 ring-2 ring-primary/50"
								: "border-border bg-muted/40 hover:bg-muted/70"
								}`}
						>
							<div className="flex items-center gap-3">
								<div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl ${selectedGameMode === "classic" ? "bg-primary/25" : "bg-muted"}`}>
									🎬
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-base font-semibold text-heading">Classic</p>
									<p className="text-sm text-body">Vote on 10 movies and get the final result immediately!</p>
								</div>
								<div className="flex items-center gap-2">
									<div
										className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${selectedGameMode === "classic"
											? "border-primary bg-primary"
											: "border-muted-foreground/60 bg-transparent"
											}`}
									>
										<div className={`h-2.5 w-2.5 rounded-full ${selectedGameMode === "classic" ? "bg-primary-foreground" : "bg-transparent"}`} />
									</div>
								</div>
							</div>
						</button>

						<button
							type="button"
							onClick={() => setSelectedGameMode("tournament")}
							aria-pressed={selectedGameMode === "tournament"}
							className={`w-full rounded-lg border-2 p-4 transition-colors text-left ${selectedGameMode === "tournament"
								? "border-accent bg-accent/20 ring-2 ring-accent/50"
								: "border-border bg-muted/40 hover:bg-muted/70"
								}`}
						>
							<div className="flex items-center gap-3">
								<div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl ${selectedGameMode === "tournament" ? "bg-accent/25" : "bg-muted"}`}>
									🏆
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-base font-semibold text-heading">Tournament</p>
									<p className="text-sm text-body">Bracket-style rounds to find the ultimate movie for your group.</p>
								</div>
								<div className="flex items-center gap-2">
									<div
										className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${selectedGameMode === "tournament"
											? "border-accent bg-accent"
											: "border-muted-foreground/60 bg-transparent"
											}`}
									>
										<div className={`h-2.5 w-2.5 rounded-full ${selectedGameMode === "tournament" ? "bg-accent-foreground" : "bg-transparent"}`} />
									</div>
								</div>
							</div>
						</button>
					</div>
				</div>
			)}

			<div className="flex flex-col items-center gap-2 w-full">
				<h2 className="text-4xl font-black text-center text-gradient">
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
						{ label: "Game Mode", value: "gamemode" },
					]}
					value={selected}
					onChange={setSelected}
					className="w-full justify-center"
				/>
			</div>
		</div>
	);
}
