"use client";

import { useState, useEffect, useRef } from "react";
import HomePage from "./components/_components/_pages/HomePage";
import CreatePage from "./components/_components/_pages/CreatePage";
import { RemoveScroll } from "react-remove-scroll";
import WaitingPage from "./components/_components/_pages/WaitingPage";
import JoinPage from "./components/_components/_pages/JoinPage";
import ResultsPage from "./components/_components/_pages/ResultPage";
import VotingPage from "./components/_components/_pages/VotingPage";
import { CustomMovie, Result } from "@/types/movies";
import { socket } from "./socket";

type Screen = "home" | "create" | "join" | "waiting" | "review" | "results";

export default function Home() {
	const [currentScreen, setCurrentScreen] = useState<Screen>("home");
	const [roomCode, setRoomCode] = useState<string>("");
	const currentScreenRef = useRef<Screen>("home"); // Add ref to track screen

	const [movies, setMovies] = useState<CustomMovie[]>([]);
	const [results, setResults] = useState<Result[]>([]);

	// Keep ref in sync with state
	useEffect(() => {
		currentScreenRef.current = currentScreen;
	}, [currentScreen]);

	// Connect socket when component mounts - ONLY ONCE
	useEffect(() => {
		socket.connect();

		socket.on("connect", () => {
			console.log("✅ Socket connected:", socket.id);
		});

		socket.on("joined-session", (data) => {
			console.log("✅ Successfully joined session:", data);
		});

		socket.on("session-update", (data) => {
			console.log("🔔 Session update received:", data);
			console.log("📍 Current screen:", currentScreenRef.current);

			// Handle game start - only navigate if we're still in create/waiting screens
			if (data.sessionState === true && data.currentMovies) {
				console.log("📽️ Received movies:", data.currentMovies.length);
				setMovies(data.currentMovies);

				// Use ref to get current screen value without closure issues
				if (currentScreenRef.current === "create" || currentScreenRef.current === "waiting") {
					console.log("🎮 Starting game, navigating to review");
					setCurrentScreen("review");
				}
			}

			// Handle results updates (real-time voting)
			if (data.results) {
				console.log("📊 Updated results received:", data.results.length);
				setResults(data.results);
			}
		});

		socket.on("error", (error) => {
			console.error("❌ Socket error:", error);
		});

		return () => {
			socket.off("connect");
			socket.off("joined-session");
			socket.off("session-update");
			socket.off("error");
			socket.disconnect();
		};
	}, []); // Empty array - only run once on mount!

	// Helper to emit join-session with connection check
	const joinSocketSession = (sessionID: string) => {
		console.log("🔵 Attempting to join session:", sessionID, "Socket connected:", socket.connected);

		if (socket.connected) {
			socket.emit("join-session", sessionID);
		} else {
			// Wait for connection, then emit
			socket.once("connect", () => {
				console.log("🔵 Socket connected, now joining session:", sessionID);
				socket.emit("join-session", sessionID);
			});
		}
	};

	const handleCreateRoom = async () => {
		const res = await fetch("/api/session/create", { method: "POST" });
		const data = await res.json();

		if (data.sessionID) {
			const sessionID = data.sessionID.toString();
			setRoomCode(sessionID);
			joinSocketSession(sessionID);
			setCurrentScreen("create");
		}
	};

	const handleJoinRoom = async (code: string) => {
		const res = await fetch("/api/session/join", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ sessionID: code }),
		});

		if (res.ok) {
			setRoomCode(code);
			joinSocketSession(code);
			setCurrentScreen("waiting");
		}
	};

	const handleNavigate = (screen: Screen, code?: string) => {
		setCurrentScreen(screen);
		if (code) setRoomCode(code);
	};

	return (
		<RemoveScroll>
			<div className="relative min-h-dvh bg-primary px-4 py-4">
				<div className="mx-auto w-full max-w-screen-sm">
					{currentScreen === "home" && <HomePage onNavigate={handleNavigate} onCreateRoom={handleCreateRoom} />}
					{currentScreen === "join" && <JoinPage onNavigate={handleNavigate} onJoinRoom={handleJoinRoom} />}
					{currentScreen === "create" && (
					<CreatePage onNavigate={handleNavigate} setMovies={setMovies} roomCode={roomCode} />
				)}
					{currentScreen === "waiting" && <WaitingPage onNavigate={handleNavigate} roomCode={roomCode} />}
					{currentScreen === "review" && (
					<VotingPage
						movies={movies ?? []}
						setResults={setResults}
						onNavigate={handleNavigate}
						roomCode={roomCode}
					/>
				)}
					{currentScreen === "results" && <ResultsPage results={results} />}
				</div>
			</div>
		</RemoveScroll>
	);
}
