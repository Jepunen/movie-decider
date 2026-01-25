import React from "react";
import Image from "next/image";

interface ResultCardPosterProps {
  posterPath?: string | null;
  title?: string | null;
}

export const ResultCardPoster: React.FC<ResultCardPosterProps> = ({
  posterPath,
  title,
}) => {
  return (
    <div className="relative w-28 h-44">
      {/* TODO: Instead of a static fallback image, implement a dynamic placeholder generation system  to not give wrong information to user */}
      <Image
        src={posterPath ?? "/movie_posters_DEV/the_martian.jpg"}
        alt={title ?? "Movie Poster"}
        fill
        className="object-cover rounded-lg shadow-md"
        sizes="96px"
      />
    </div>
  );
};
