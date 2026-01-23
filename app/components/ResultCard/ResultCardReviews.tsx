import React from "react";
import Image from "next/image";

export interface ReviewsProps {
  IMDBRating?: string;
  RottenTomatoesRating?: string;
  MetacriticRating?: string;
}

interface RatingItemProps {
  src: string;
  alt: string;
  rating: string;
}

const RatingItem: React.FC<RatingItemProps> = ({ src, alt, rating }) => (
  <div className="flex flex-row items-center gap-0.5">
    <Image src={src} alt={alt} width={18} height={18} />
    <p className="text-sm">{rating}</p>
  </div>
);

const ResultCardReviews: React.FC<ReviewsProps> = ({
  IMDBRating,
  RottenTomatoesRating,
  MetacriticRating,
}) => {
  return (
    <div className="flex flex-row font-black text-text justify-left gap-2 w-full max-w-md">
      {IMDBRating && (
        <RatingItem src="/IMDb_logo.svg" alt="IMDB" rating={IMDBRating} />
      )}
      {RottenTomatoesRating && (
        <RatingItem
          src="/Rotten_Tomatoes_logo.svg"
          alt="Rotten Tomatoes"
          rating={RottenTomatoesRating}
        />
      )}
      {MetacriticRating && (
        <RatingItem
          src="/Metacritic_logo.svg"
          alt="Metacritic"
          rating={MetacriticRating}
        />
      )}
    </div>
  );
};

export default ResultCardReviews;
