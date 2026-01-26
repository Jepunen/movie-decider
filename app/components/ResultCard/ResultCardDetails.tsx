import React from "react";
import type { Movie } from "../../../types/movies";
import ResultCardReviews from "./ResultCardReviews";
import { genreMap } from "@/app/constants/genres";

interface ResultDetailsProps {
  movie: Movie;
}

export const ResultCardDetails: React.FC<ResultDetailsProps> = ({
  movie,
}) => {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Unknown";

  const genres = movie.genres?.length ? movie.genres.map(genre => genreMap[genre] || genre).join(", ") : "N/A";

  return (
    <div className="flex flex-col justify-center h-full space-y-1">
      <h2 className="font-bold text-xl">{movie.title}</h2>
      <div className="flex flex-row gap-3">
        <p className="text-md">{releaseYear}</p>
        <p className="text-md">{movie.runtime}min</p>
      </div>
      <p className="text-sm">{genres}</p>
      <ResultCardReviews
        IMDBRating={movie.ratings?.find(r => r.Source === "Internet Movie Database")?.Value}
        RottenTomatoesRating={movie.ratings?.find(r => r.Source === "Rotten Tomatoes")?.Value}
        MetacriticRating={movie.ratings?.find(r => r.Source === "Metacritic")?.Value}
      />
    </div>
  );
};
