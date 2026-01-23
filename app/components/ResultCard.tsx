"use client";

import React, { useState } from "react";
import type { Movie } from "../../types/movies";
import { ResultCardDetails } from "./ResultCard/ResultCardDetails";
import { ResultCardCompatibility } from "./ResultCard/ResultCardCompatibility";
import { ResultCardPoster } from "./ResultCard/ResultCardPoster";
import { ResultCardModal } from "./ResultCard/ResultCardModal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex w-full max-w-md h-48 rounded-lg shadow bg-secondary overflow-hidden">
      <div className="flex items-center justify-center h-full pl-2 pr-2">
        <ResultCardPoster posterPath={movie.poster_path} title={movie.title} />
      </div>
      <div className="flex flex-col justify-between flex p-0.5">
        <ResultCardDetails
          movie={movie}
          IMDBRating={IMDBRating}
          RottenTomatoesRating={RottenTomatoesRating}
          MetacriticRating={MetacriticRating}
        />
      </div>
      <div className="flex flex-col items-center justify-between h-42 w-22 pt-6 pr-3 pl-1">
        <ResultCardCompatibility compatibilityScore={compatibilityScore} />
        <div>
          <Button onClick={() => setIsModalOpen(true)}>Info</Button>
        </div>
      </div>
      <ResultCardModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={movie}
      />
    </div>
  );
};

export default ReviewCard;
