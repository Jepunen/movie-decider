import React from "react";
import type { Movie } from "../../../types/movies";
import ResultCardReviews from "./ResultCardReviews";

interface ResultDetailsProps {
  movie: Movie;
  IMDBRating?: string;
  RottenTomatoesRating?: string;
  MetacriticRating?: string;
}

export const ResultCardDetails: React.FC<ResultDetailsProps> = ({
  movie,
  IMDBRating,
  RottenTomatoesRating,
  MetacriticRating,
}) => {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Unknown";

  const genres = movie.genre_ids?.length ? movie.genre_ids.join(", ") : "N/A";

  return (
    <div className="flex flex-col justify-center h-full space-y-1">
      <h2 className="font-bold text-xl">{movie.title}</h2>
      <div className="flex flex-row gap-3">
        <p className="text-lg">{releaseYear}</p>
        <p className="text-lg">197min</p> {/* Placeholder for runtime */}
      </div>
      <p className="text-md">{genres}</p>
      <ResultCardReviews
        IMDBRating={IMDBRating}
        RottenTomatoesRating={RottenTomatoesRating}
        MetacriticRating={MetacriticRating}
      />
    </div>
  );
};
