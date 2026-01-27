import React from "react";
import type { CustomMovie } from "@/types/movies";
import ResultCardReviews from "./ResultCardReviews";
import { genreMap } from "@/app/constants/genres";

interface ResultDetailsProps {
  movie: CustomMovie;
}

export const ResultCardDetails: React.FC<ResultDetailsProps> = ({ movie }) => {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Unknown";

  const genres = movie.genres?.length
    ? movie.genres.map((genre) => genreMap[genre] || genre).join(", ")
    : "N/A";

  return (
    <div className="flex flex-col justify-center space-y-1 flex-1">
      <h2 className="font-bold text-lg sm:text-xl line-clamp-2">{movie.title}</h2>
      <div className="flex flex-row gap-3 text-sm">
        <p>{releaseYear}</p>
        <p>{movie.runtime}min</p>
      </div>
      <p className="text-xs sm:text-sm line-clamp-2">{genres}</p>
      <ResultCardReviews
        IMDBRating={
          movie.ratings?.find((r) => r.Source === "Internet Movie Database")
            ?.Value
        }
        RottenTomatoesRating={
          movie.ratings?.find((r) => r.Source === "Rotten Tomatoes")?.Value
        }
        MetacriticRating={
          movie.ratings?.find((r) => r.Source === "Metacritic")?.Value
        }
      />
    </div>
  );
};
