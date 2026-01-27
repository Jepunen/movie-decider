import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { MovieCardFront } from "../_MovieCard/MovieCardFront";
import { MovieCardBack } from "../_MovieCard/MovieCardBack";
import type { CustomMovie } from "@/types/movies";
import { genreMap } from "@/app/constants/genres";

export interface MovieCardProps {
  movie: CustomMovie;
  IMDBRating?: string;
  RottenTomatoesRating?: string;
  MetacriticRating?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="max-w-md">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <MovieCardFront
          key="front"
          movie={movie}
          onClick={() => setIsFlipped(true)}
        />
        <MovieCardBack
          key="back"
          movie={movie}
          onClick={() => setIsFlipped(false)}
        />
      </ReactCardFlip>
    </div>
  );
};

export default MovieCard;
