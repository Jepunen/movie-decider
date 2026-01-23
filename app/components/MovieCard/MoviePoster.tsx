import React from "react";
import Image from "next/image";

interface MoviePosterProps {
  posterPath?: string | null;
  title?: string | null;
}

export const MoviePoster: React.FC<MoviePosterProps> = ({ posterPath, title }) => {
  return (
    <div className="relative h-96 w-full mb-4 shrink-0">
      <Image
        src={posterPath ?? "/movie_posters_DEV/the_martian.jpg"}
        alt={title ?? "Movie Poster"}
        fill
        className="rounded object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
