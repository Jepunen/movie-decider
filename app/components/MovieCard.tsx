import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { MovieCardFront } from "./MovieCard/MovieCardFront";
import { MovieCardBack } from "./MovieCard/MovieCardBack";
import type { Movie } from "../../types/movies";

export interface MovieCardProps {
  movie: Movie;
  IMDBRating?: string;
  RottenTomatoesRating?: string;
  MetacriticRating?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  IMDBRating,
  RottenTomatoesRating,
  MetacriticRating,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="p-4">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <MovieCardFront
          key="front"
          movie={movie}
          IMDBRating={IMDBRating}
          RottenTomatoesRating={RottenTomatoesRating}
          MetacriticRating={MetacriticRating}
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
