import React from "react";
import { MoviePoster } from "./MoviePoster";
import { MovieDetails } from "./MovieDetails";
import Reviews from "../_components/Reviews";
import type { CustomMovie } from "@/types/movies";

interface MovieCardFrontProps {
  movie: CustomMovie;
  onClick: () => void;
}

export const MovieCardFront: React.FC<MovieCardFrontProps> = ({
  movie,
  onClick,
}) => {
  return (
    <div
      className="p-4 rounded-xl shadow w-sm bg-secondary front h-120 flex flex-col overflow-y-auto"
      onClick={onClick}
    >
      <MoviePoster posterPath={movie.poster_url} title={movie.title} priority />
      <MovieDetails movie={movie} />
      <div className="ms-4 me-4">
        <Reviews
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
    </div>
  );
};
