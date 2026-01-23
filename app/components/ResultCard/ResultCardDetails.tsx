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
      <h2 className="font-bold text-2xl">{movie.title}</h2>
      <p className="text-xl">{releaseYear}</p>
      <p className="text-lg">{genres}</p>
      <ResultCardReviews
        IMDBRating={IMDBRating}
        RottenTomatoesRating={RottenTomatoesRating}
        MetacriticRating={MetacriticRating}
        />
    </div>
  );
};
