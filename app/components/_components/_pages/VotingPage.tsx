import { useState, useEffect } from "react";
import Header from "../_ui/Header";
import Button from "../Button";
import type { Screen } from "@/types/screen";
import { CustomMovie, Result } from "@/types/movies";
import MovieCard from "../MovieCard";
import RateButton from "../RateButton";
import { motion, AnimatePresence } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

interface VotingPageProps {
	movies: CustomMovie[] | undefined;
	setResults: Dispatch<SetStateAction<Result[]>>;
	onNavigate: (screen: Screen) => void;
	roomCode: string;
}

export default function VotingPage({
	movies,
	setResults,
	onNavigate,
	roomCode,
}: VotingPageProps) {
	const [currentMovie, setCurrentMovie] = useState(0);

	// Preload next movie poster
	useEffect(() => {
		if (!movies) return;
		const next = movies[currentMovie + 1];
		if (!next?.poster_url) return;

		const img = new Image();
		img.src = next.poster_url;
	}, [currentMovie, movies]);

	// Navigate to results when all movies are rated
	useEffect(() => {
		if (movies && currentMovie >= movies.length) {
			onNavigate("results");
		}
	}, [currentMovie, movies, onNavigate]);

	const sendVoteToAPI = async (movie: CustomMovie, rate: number) => {
		try {
			const response = await fetch("/api/score", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					sessionID: roomCode,
					CustomMovie: movie,
					score: rate.toString(),
				}),
			});

			if (response.ok) {
				const data = await response.json();
				// console.log("✅ Vote submitted:", data);
			}
		} catch (error) {
			console.error("❌ Error submitting vote:", error);
		}
	};

	const handleVote = async (rate: number) => {
		if (!movies) return;
		await sendVoteToAPI(movies[currentMovie], rate);
		setCurrentMovie((prev) => prev + 1);
	};

	const handleSkip = () => {
		setCurrentMovie((prev) => prev + 1);
	};

	// Early returns for loading and completion states
	if (!movies) {
		return <div>Loading movies...</div>;
	}

	if (currentMovie >= movies.length) {
		return null;
	}

	const movie = movies[currentMovie];

	return (
		<div className="relative flex flex-col min-h-[calc(100dvh-2rem)] w-full max-w-screen-sm mx-auto gap-5 pb-6 px-2">
			<div className="pt-10">
				<Header />
			</div>
			<div className="flex flex-col gap-4 flex-1">
				<AnimatePresence mode="wait">
					<motion.div
						key={movie.imdb_id || movie.title}
						initial={{ x: 300, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -300, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="flex justify-center"
					>
						<MovieCard movie={movie} />
					</motion.div>
				</AnimatePresence>
				<div className="flex flex-row flex-wrap justify-center gap-3">
					<RateButton rate="worst" onClick={() => handleVote(1)} />
					<RateButton rate="bad" onClick={() => handleVote(2)} />
					<RateButton rate="normal" onClick={() => handleVote(3)} />
					<RateButton rate="good" onClick={() => handleVote(4)} />
					<RateButton rate="best" onClick={() => handleVote(5)} />
				</div>
				<Button onClick={handleSkip}>Skip</Button>
			</div>
		</div>
	);
}
