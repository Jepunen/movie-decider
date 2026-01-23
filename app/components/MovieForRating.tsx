import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import Reviews from "./Reviews";
import Image from "next/image";
import type { Movie } from "../../types/movies";

export interface MovieForRatingProps {
  movie: Movie;
  IMDBRating?: string;
  RottenTomatoesRating?: string;
  MetacriticRating?: string;
}

const MovieForRating: React.FC<MovieForRatingProps> = ({
  movie,
  IMDBRating,
  RottenTomatoesRating,
  MetacriticRating,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // TODO: Add safe guards for missing data
  return (
    <div className="p-4">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <div
          key="front"
          className="p-4 rounded shadow max-w-md bg-secondary front h-150 flex flex-col overflow-y-auto"
          onClick={() => setIsFlipped(true)}
        >
          <div className="relative h-96 w-full mb-4 shrink-0">
            <Image
              src={movie.poster_path ?? "/movie_posters_DEV/the_martian.jpg"}
              alt={movie.title ?? "The Martian Poster"}
              fill
              className="rounded object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="text-center mt-4">
            <h2 className="text-4xl font-bold mb-2">{movie.title}</h2>
            <p className="text-2xl text-gray-300">
              {new Date(movie.release_date).getFullYear()}
            </p>
            {/* TODO: Implement genre mapping from IDs to names */}
            <p className="text-2xl text-gray-300">
              {movie.genre_ids.join(", ")}
            </p>
          </div>
          <div className="ms-6 me-6">
            <Reviews
              IMDBRating={IMDBRating}
              RottenTomatoesRating={RottenTomatoesRating}
              MetacriticRating={MetacriticRating}
            />
          </div>
        </div>

        <div
          key="back"
          className="p-4 rounded shadow max-w-md bg-secondary front h-150 flex flex-col overflow-y-auto"
          onClick={() => setIsFlipped(false)}
        >
          <h3 className="text-2xl font-bold mb-2">{movie.title}</h3>
          <p className="text-base mb-3">{movie.overview}</p>
          <p className="text-sm">Popularity: {movie.popularity}</p>
          <p className="text-sm">Votes: {movie.vote_count}</p>
          <p className="text-sm">Release: {movie.release_date}</p>
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default MovieForRating;
