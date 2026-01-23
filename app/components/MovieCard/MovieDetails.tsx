import React from "react";
import type { Movie } from "../../../types/movies";

interface MovieDetailsProps {
  movie: Movie;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Unknown";

  const genres = movie.genre_ids?.length ? movie.genre_ids.join(", ") : "N/A";

  return (
    <div className="text-center mt-4">
      <h2 className="text-4xl font-bold mb-2">{movie.title ?? "Unknown Title"}</h2>
      <p className="text-2xl text-gray-300">{releaseYear}</p>
      <p className="text-2xl text-gray-300">{genres}</p>
    </div>
  );
};
