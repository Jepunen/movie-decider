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

  return (
    <div className="p-4">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <div
          key="front"
          className="p-4 rounded shadow max-w-md bg-secondary front"
          onClick={() => setIsFlipped(true)}
        >
          <Image
            src={movie.poster_path ?? "/movie_posters_DEV/the_martian.jpg"}
            alt={movie.title ?? "The Martian Poster"}
            width={400}
            height={400}
            className="rounded shadow"
          />
          <div className="text-center mt-4">
            <h2 className="text-4xl font-bold mb-2">{movie.title}</h2>
            <p className="text-2xl text-gray-300">
              {new Date(movie.release_date).getFullYear()}
            </p>
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
          className="p-4 rounded shadow max-w-md bg-secondary front"
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
