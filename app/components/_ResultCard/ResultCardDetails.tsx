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

  // Show up to 3 genres, mapped to their names
  const genres = movie.genres?.length
    ? movie.genres.slice(0, 3).map((genre) => genreMap[genre] || genre).join(", ")
    : "N/A";

  return (
    <div className="flex flex-col justify-center h-full space-y-1">
      <h2 className="font-bold text-xl">{movie.title}</h2>
      <div className="flex flex-row gap-3">
        <p className="text-md">{releaseYear}</p>
        <p className="text-md">{movie.runtime}</p>
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
