import React from "react";
import Image from "next/image";

interface MoviePosterProps {
  posterPath?: string | null;
  title?: string | null;
}

export const MoviePoster: React.FC<MoviePosterProps> = ({
  posterPath,
  title,
}) => {
  return (
    <div className="relative h-76 w-48 mb-2 shrink-0 self-center">
      <Image
        loading="lazy"
        src={posterPath ?? "/movie_posters_DEV/the_martian.jpg"}
        alt={title ?? "Movie Poster"}
        fill
        className="object-cover rounded-lg shadow-md"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
