import React from "react";
import type { Movie } from "../../../types/movies";

interface MovieCardBackProps {
  movie: Movie;
  onClick: () => void;
}

export const MovieCardBack: React.FC<MovieCardBackProps> = ({ movie, onClick }) => {
  return (
    <div
      className="p-4 rounded-xl shadow w-sm bg-secondary front h-120 flex flex-col overflow-y-auto"
      onClick={onClick}
    >
      <h3 className="text-2xl font-bold mb-2">{movie.title ?? "Unknown Title"}</h3>
      <p className="mb-2">{movie.description ?? "No description available."}</p>
      <p className="mb-1">
        <strong>Release Date:</strong> {movie.release_date ?? "N/A"}
      </p>
      <p className="mb-1">
        <strong>Director:</strong> {movie.director ?? "N/A"}
      </p>
      <p className="mb-1">
        <strong>Actors:</strong> {movie.actors ?? "N/A"}
      </p>
    </div>
  );
};
