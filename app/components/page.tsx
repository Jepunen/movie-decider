"use client";

import React, { useState } from "react";
import HelloWorld from "./HelloWorld";
import Button from "./Button";
import Header from "./Header";
import Reviews from "./Reviews";
import RoomCode from "./RoomCode";
import StatusImage from "@/app/components/StatusImage";
import PillButtonGroup from "./PillButtonGroup";
import RateButton from "./RateButton";
import type { Movie } from "../../types/movies";
import MovieCard from "./MovieCard";
import ResultCard from "./ResultCard";
import GenreSelector from "./GenreSelector";

// SAMPLE MOVIE DATA for testing MovieForRating component - R.M.
const sampleMovie: Movie = {
  adult: false,
  backdrop_path: null,
  genre_ids: [12, 878, 18],
  id: 101,
  original_language: "en",
  original_title: "Avatar: Fire and Ash",
  overview:
    "In the wake of the devastating war against the RDA and the loss of their eldest son, Jake Sully and Neytiri face a new threat on Pandora: the Ash People, a violent and power-hungry Na'vi tribe led by the ruthless Varang. Jake's family must fight for their survival and the future of Pandora in a conflict that pushes them to their emotional and physical limits.",
  popularity: 10.5,
  poster_path:
    "https://image.tmdb.org/t/p/w500/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg",
  release_date: "2025-12-17",
  title: "Avatar: Fire and Ash",
  video: false,
  vote_average: 8.0,
  vote_count: 10000,
};

{
    title: string;
    description: string,
    poster_url: string,
    release_date: string,
    runtime: string,
    genres: string,
    imdb_id: string,
    imdb_url: string,
    ratings: Array<{
        Source: string;
        Value: string;
    }>,
    language: string,
    director: string,
    actors: string,
}

// SAMPLE RATINGS for testing MovieForRating component - R.M.
const sampleIMDBRating = "8.5";
const sampleRottenTomatoesRating = "92%";
const sampleMetacriticRating = "85";

const ComponentsPage = () => {
  const [guestCode, setGuestCode] = useState("");
  const [selected, setSelected] = useState("action");

  return (
    <div className="bg-primary">
      <h2 className="text-accent text-center">Components Page</h2>
      <div className="flex flex-col items-center gap-4 m-4">
        <Header />
        <GenreSelector />
        <ResultCard
          movie={sampleMovie}
          IMDBRating={sampleIMDBRating}
          RottenTomatoesRating={sampleRottenTomatoesRating}
          MetacriticRating={sampleMetacriticRating}
          compatibilityScore={95}
        />
        <MovieCard
          movie={sampleMovie}
          IMDBRating={sampleIMDBRating}
          RottenTomatoesRating={sampleRottenTomatoesRating}
          MetacriticRating={sampleMetacriticRating}
        />
        <div className="flex flex-row gap-3">
          <RateButton rate="worst" />
          <RateButton rate="bad" />
          <RateButton rate="normal" />
          <RateButton rate="good" />
          <RateButton rate="best" />
        </div>
        <HelloWorld />
        <Button>Test clicking!</Button>
        <Reviews
          IMDBRating="8.5/10"
          RottenTomatoesRating="95%"
          MetacriticRating="88"
        />
        <RoomCode isHost={true} code="123456" />
        <RoomCode
          isHost={false}
          code={guestCode}
          onCodeChange={(code) => setGuestCode(code)}
        />
        <StatusImage status={"default"} />
        <StatusImage status={"hosting"} />
        <StatusImage status={"waiting"} />
        <StatusImage status={"joining"} />
        <StatusImage status={"setting"} />
        <PillButtonGroup
          options={[
            { label: "Action", value: "action" },
            { label: "Comedy", value: "comedy" },
            { label: "Drama", value: "drama" },
          ]}
          value={selected}
          onChange={setSelected}
        />
      </div>
    </div>
  );
};

export default ComponentsPage;
