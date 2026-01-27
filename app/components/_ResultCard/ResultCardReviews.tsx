import React from "react";
import Image from "next/image";

export interface ResultCardReviewsProps {
  IMDBRating?: string;
  RottenTomatoesRating?: string;
  MetacriticRating?: string;
}

interface RatingItemProps {
  src: string;
  alt: string;
  rating: string;
}

{
  /* TODO: in the future the reviews and rating items could be combined to serve both purposes */
}
const RatingItem: React.FC<RatingItemProps> = ({ src, alt, rating }) => (
  <div className="flex flex-row items-center gap-0.5">
    <Image src={src} alt={alt} width={18} height={18} />
    <p className="text-sm">{rating}</p>
  </div>
);

const ResultCardReviews: React.FC<ResultCardReviewsProps> = ({
  IMDBRating,
  RottenTomatoesRating,
  MetacriticRating,
}) => {
  return (
    <div className="flex flex-row font-black text-text justify-start gap-1 w-full flex-wrap">
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
