"use client";

import React from "react";
import type { Movie } from "../../types/movies";
import { ResultCardDetails } from "./ResultCard/ResultCardDetails";
import { ResultCardCompatibility } from "./ResultCard/ResultCardCompatibility";
import { ResultCardPoster } from "./ResultCard/ResultCardPoster";
import Button from "./Button";

export interface ReviewCardProps {
  movie: Movie;
  IMDBRating?: string;
  RottenTomatoesRating?: string;
  MetacriticRating?: string;
  compatibilityScore?: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  movie,
  IMDBRating,
  RottenTomatoesRating,
  MetacriticRating,
  compatibilityScore,
}) => {
  return (
    <div className="flex w-full max-w-md h-48 rounded-lg shadow bg-secondary overflow-hidden">
      <div className="flex items-center justify-center h-full pl-2 pr-2">
        <ResultCardPoster
          posterPath={movie.poster_path}
          title={movie.title}
        />
      </div>
      <div className="flex flex-col justify-between flex-1 p-1">
        <ResultCardDetails
          movie={movie}
          IMDBRating={IMDBRating}
          RottenTomatoesRating={RottenTomatoesRating}
          MetacriticRating={MetacriticRating}
        />
      </div>
      <div className="flex flex-col items-center justify-between h-42 w-22 pt-4 pr-4">
        <ResultCardCompatibility compatibilityScore={compatibilityScore} />
        <div>
          <Button>Info</Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
