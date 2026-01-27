import React from "react";
import type { CustomMovie } from "../../../types/movies";
import { genreMap } from "../../constants/genres";

interface MovieDetailsProps {
  movie: CustomMovie;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Unknown";

  const genres = movie.genres?.length
    ? movie.genres.slice(0, 3).map((genre) => genreMap[genre] || genre).join(", ")
    : "N/A";

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-1">
        {movie.title ?? "Unknown Title"}
      </h2>
      <div className="flex flex-row gap-6 justify-center mb-1">
        <p className="text-lg">{releaseYear}</p>
        <p className="text-lg">{movie.runtime}</p>
      </div>
      <p className="text-md text-text mb-1">{genres}</p>
    </div>
  );
};
