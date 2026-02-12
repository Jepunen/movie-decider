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
  <div className="flex flex-row items-center gap-1">
    <Image src={src} alt={alt} width={20} height={20} />
    <p>{rating}</p>
  </div>
);

const Reviews: React.FC<ReviewsProps> = ({
  IMDBRating,
  RottenTomatoesRating,
  MetacriticRating,
}) => {
  return (
    <div className="flex flex-row text-xl font-black text-foreground justify-between w-full max-w-full">
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

export default Reviews;
