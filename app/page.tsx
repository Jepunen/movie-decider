"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { socket } from "./socket";
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
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [transport, setTransport] = useState<string>("N/A");
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

	// Handle websocket connection via socket.io
	useEffect(() => {
		if (socket.connected) {
			onConnect();
		}

		function onConnect() {
			setIsConnected(true);
			setTransport(socket.io.engine.transport.name);

			socket.io.engine.on("upgrade", (transport) => {
				setTransport(transport.name);
			});
		}

		function onDisconnect() {
			setIsConnected(false);
			setTransport("N/A");
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
		};
	}, []);

	const mockResults = [
    { movie: "Movie A", compatibility: 5 }
  ];

	return (
		<RemoveScroll>
			<div className="relative min-h-screen bg-primary p-4">
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
		</RemoveScroll>
	);
}
