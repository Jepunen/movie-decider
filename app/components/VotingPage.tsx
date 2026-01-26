import React, { useState } from "react";
import Header from "./Header";
import Button from "./Button";
import type { Screen } from "@/types/screen";
import { Movie } from "@/types/movies";
import MovieCard from "./MovieCard";
import RateButton from "./RateButton";
import { motion, AnimatePresence } from "framer-motion";

interface VotingPageProps {
    movies: Movie[];
    onNavigate: (screen: Screen) => void;
}
export default function VotingPage({ movies, onNavigate }: VotingPageProps) {
    const [currentMovie, setCurrentMovie] = useState(0);


    // TODO: Replace with actual API call
    const sendVoteToAPI = async (movie: Movie, rate: number) => {
        // Placeholder function to simulate sending vote to an API
        console.log(`Voted ${rate} for movie: ${movie.title}`);
    }

    const handleVote = async (rate: number) => {
        await sendVoteToAPI(movies[currentMovie], rate);
        setCurrentMovie((prev) => prev + 1);
    };

    const handleSkip = () => {
        setCurrentMovie((prev) => prev + 1);
    };

    if (currentMovie >= movies.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)] w-full">
                <Header />
                <div className="mt-8 mb-8 text-2xl font-bold text-accent">All movies rated! 🎉</div>
                <Button onClick={() => onNavigate("results")}>See Results</Button>
            </div>
        );
    }

    const movie = movies[currentMovie];

    return (
        <div className="flex flex-col items-center justify-between min-h-[calc(100vh-2rem)] w-full">
            <div className="mt-8">
                <Header />
            </div>
            <div className="flex flex-col items-center gap-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentMovie}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full flex flex-col items-center"
                    >
                        <MovieCard movie={movie} />
                    </motion.div>
                </AnimatePresence>
                <div className="flex flex-row gap-3">
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