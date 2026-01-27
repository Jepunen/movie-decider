"use client";

import React, { useState } from "react";
import type { CustomMovie } from "@/types/movies";
import { ResultCardDetails } from "../_ResultCard/ResultCardDetails";
import { ResultCardCompatibility } from "../_ResultCard/ResultCardCompatibility";
import { ResultCardPoster } from "../_ResultCard/ResultCardPoster";
import { ResultCardModal } from "../_ResultCard/ResultCardModal";
import Button from "./Button";

export interface ResultCardProps {
  movie: CustomMovie;
  IMDBRating?: string;
  RottenTomatoesRating?: string;
  MetacriticRating?: string;
  compatibilityScore?: number;
}

const ResultCard: React.FC<ResultCardProps> = ({
  movie,
  compatibilityScore,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex w-full max-w-md h-48 rounded-lg shadow bg-secondary overflow-hidden justify-between">
      <div className="flex items-center justify-center h-full pl-2 pr-2">
        <ResultCardPoster posterPath={movie.poster_url} title={movie.title} />
      </div>
      <div className="flex flex-col flex-1">
        <ResultCardDetails movie={movie} />
      </div>
      <div className="flex flex-row sm:flex-col items-center justify-between h-auto sm:h-44 w-full sm:w-24 gap-3 sm:gap-0 sm:pt-6 sm:pr-3 sm:pl-1">
        <ResultCardCompatibility compatibilityScore={compatibilityScore} />
        <div className="w-full sm:w-auto">
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

export default ResultCard;
