"use client";

import { useState, useEffect } from "react";
import HomePage from "./components/_components/_pages/HomePage";
import CreatePage from "./components/_components/_pages/CreatePage";
import { RemoveScroll } from "react-remove-scroll";
import WaitingPage from "./components/_components/_pages/WaitingPage";
import JoinPage from "./components/_components/_pages/JoinPage";
import ResultsPage from "./components/_components/_pages/ResultPage";
import VotingPage from "./components/_components/_pages/VotingPage";
import { CustomMovie, Result } from "@/types/movies";

type Screen = "home" | "create" | "join" | "waiting" | "review" | "results";

export default function Home() {
	const [currentScreen, setCurrentScreen] = useState<Screen>("home");
	const [roomCode, setRoomCode] = useState<string>("");

	const [movies, setMovies] = useState<CustomMovie[]>([]);
	const [results, setResults] = useState<Result[]>([]);

	// TODO: Implement movie fetching and passing to VotingPage after user starts the game from hosts CreatePage
	// TODO: Implement results fetching and passing to ResultsPage after voting is complete

	const handleNavigate = (screen: Screen, code?: string) => {
		setCurrentScreen(screen);
		if (code) setRoomCode(code);
	};

	return (
		<RemoveScroll>
			<div className="relative min-h-dvh bg-primary px-4 py-4">
				<div className="mx-auto w-full max-w-screen-sm">
					{currentScreen === "home" && (
						<HomePage onNavigate={handleNavigate} />
					)}
					{currentScreen === "join" && (
						<JoinPage onNavigate={handleNavigate} />
					)}
					{currentScreen === "create" && (
						<CreatePage
							onNavigate={handleNavigate}
							setMovies={setMovies}
							roomCode={roomCode}
					/>
					)}
					{currentScreen === "waiting" && (
						<WaitingPage onNavigate={handleNavigate} />
					)}
					{currentScreen === "review" && (
						<VotingPage
							movies={movies ?? []}
							setResults={setResults}
							onNavigate={handleNavigate}
						/>
					)}
					{currentScreen === "results" && (
						<ResultsPage results={results} />
					)}
				</div>
			</div>
		</RemoveScroll>
	);
}
