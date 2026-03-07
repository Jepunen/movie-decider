

import Image from "next/image";
import Button from "./Button";
import type { CustomMovie } from "@/types/movies";
import { genreMap } from "@/app/constants/genres";
import { useState } from "react";
import { ResultCardModal } from "../_ResultCard/ResultCardModal";


interface TournamentMovieCardProps {
    movie: CustomMovie;
    onPick: () => void;
    /** Disable the pick button (e.g. while a vote is being submitted) */
    disabled?: boolean;
}


export default function TournamentMovieCard({ movie, onPick, disabled }: TournamentMovieCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const genres = movie.genres?.length
        ? movie.genres.slice(0, 3).map((genre) => genreMap[genre] || genre).join(" • ")
        : "N/A";

    return (
        <div className="flex h-full flex-col rounded-2xl glass-card overflow-hidden w-full">
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
                    <Button onClick={() => setIsModalOpen(true)}>Info</Button>
                    <Button onClick={onPick} disabled={disabled} className="p-3 text-sm">
                        Choose This Movie
                    </Button>
                </div>
            </div>

            <ResultCardModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                movie={movie}
            />
        </div>
    );
}