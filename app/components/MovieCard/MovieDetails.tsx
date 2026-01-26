import React from "react";
import type { Movie } from "../../../types/movies";
import { genreMap } from "../../constants/genres";

interface MovieDetailsProps {
  movie: Movie;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Unknown";

  const genres = movie.genres?.length ? movie.genres.map(genre => genreMap[genre] || genre).join(", ") : "N/A";

  return (
    <div className="text-center mt-4">
      <h2 className="text-4xl font-bold mb-2">{movie.title ?? "Unknown Title"}</h2>
      <div className="flex flex-row gap-2 justify-center mb-1">
        <p className="text-xl">{releaseYear}</p>
        <p className="text-xl">{movie.runtime}min</p>
      </div>
      <p className="text-md text-text mb-2">{genres}</p>
    </div>
  );
};
