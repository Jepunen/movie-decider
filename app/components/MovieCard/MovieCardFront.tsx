import React from "react";
import { MoviePoster } from "./MoviePoster";
import { MovieDetails } from "./MovieDetails";
import Reviews from "../Reviews";
import type { Movie } from "../../../types/movies";

interface MovieCardFrontProps {
  movie: Movie;
  IMDBRating?: string;
  RottenTomatoesRating?: string;
  MetacriticRating?: string;
  onClick: () => void;
}

export const MovieCardFront: React.FC<MovieCardFrontProps> = ({
  movie,
  IMDBRating,
  RottenTomatoesRating,
  MetacriticRating,
  onClick,
}) => {
  return (
    <div
      className="p-4 rounded shadow max-w-md bg-secondary front h-150 flex flex-col overflow-y-auto"
      onClick={onClick}
    >
      <MoviePoster posterPath={movie.poster_path} title={movie.title} />
      <MovieDetails movie={movie} />
      <div className="ms-6 me-6">
        <Reviews
          IMDBRating={IMDBRating}
          RottenTomatoesRating={RottenTomatoesRating}
          MetacriticRating={MetacriticRating}
        />
      </div>
    </div>
  );
};
