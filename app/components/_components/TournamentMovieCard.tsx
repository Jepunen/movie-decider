
import Image from "next/image";
import Button from "./Button";
import type { CustomMovie } from "@/types/movies";
import { genreMap } from "@/app/constants/genres";
import { useState } from "react";
import { ResultCardModal } from "../_ResultCard/ResultCardModal";
import { motion } from "framer-motion";


interface TournamentMovieCardProps {
    movie: CustomMovie;
    onPick: () => void;
    /** Disable the pick button (e.g. while a vote is being submitted) */
    disabled?: boolean;
    /** This card was chosen by the user */
    isSelected?: boolean;
    /** The other card was chosen — this one is eliminated */
    isEliminated?: boolean;
}


export default function TournamentMovieCard({ movie, onPick, disabled, isSelected, isEliminated }: TournamentMovieCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const genres = movie.genres?.length
        ? movie.genres.slice(0, 3).map((genre) => genreMap[genre] || genre).join(" • ")
        : "N/A";

    return (
        <>
            <motion.div
                className="flex h-full flex-col rounded-2xl glass-card overflow-hidden w-full relative"
                animate={
                    isSelected
                        ? { scale: 1.04, boxShadow: "0 0 32px 8px rgba(34,197,94,0.55)" }
                        : isEliminated
                            ? { scale: 0.93, opacity: 0.35 }
                            : { scale: 1, opacity: 1, boxShadow: "none" }
                }
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
                {/* Winner crown overlay */}
                {isSelected && (
                    <motion.div
                        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
                    >
                        <div className="bg-green-500/90 rounded-full p-4 shadow-xl shadow-green-500/50">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </motion.div>
                )}

                <div className="aspect-2/3 w-full bg-black/20 overflow-hidden relative">
                    <Image
                        src={movie.poster_url}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 45vw, 300px"
                    />
                </div>
                <div className="p-3 flex flex-1 flex-col">
                    <div className="flex h-24 flex-col gap-2 overflow-hidden">
                        <h2 className="text-lg font-bold leading-tight text-foreground line-clamp-2 h-10 shrink-0">
                            {movie.title}
                        </h2>
                        <p className="text-xs text-foreground/70 shrink-0">
                            {movie.release_date.slice(0, 4)} • {movie.runtime}
                        </p>
                        <p className="text-xs text-foreground/70 line-clamp-1 shrink-0">
                            {genres}
                        </p>
                    </div>

                    <div className="mt-auto flex flex-col gap-2 pt-3">
                        {/* Info — outlined ghost button */}
                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(true)}
                            disabled={disabled}
                            className="p-2 text-sm font-semibold gap-1.5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                            </svg>
                            Info
                        </Button>

                        {/* Choose — bold primary CTA */}
                        <Button
                            onClick={onPick}
                            disabled={disabled}
                            className="p-3 text-sm gap-1.5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            Choose
                        </Button>
                    </div>
                </div>
            </motion.div>

            <ResultCardModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                movie={movie}
            />
        </>
    );
}