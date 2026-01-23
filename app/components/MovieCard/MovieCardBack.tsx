import React from "react";
import type { Movie } from "../../../types/movies";

interface MovieCardBackProps {
  movie: Movie;
  onClick: () => void;
}

export const MovieCardBack: React.FC<MovieCardBackProps> = ({ movie, onClick }) => {
  return (
    <div
      className="p-4 rounded shadow max-w-md bg-secondary front h-150 flex flex-col overflow-y-auto"
      onClick={onClick}
    >
      <h3 className="text-2xl font-bold mb-2">{movie.title ?? "Unknown Title"}</h3>
      <p className="text-base mb-3">{movie.overview ?? "No description available"}</p>
      <p className="text-sm">Popularity: {movie.popularity ?? "N/A"}</p>
      <p className="text-sm">Votes: {movie.vote_count ?? "N/A"}</p>
      <p className="text-sm">Release: {movie.release_date ?? "Unknown"}</p>
    </div>
  );
};
