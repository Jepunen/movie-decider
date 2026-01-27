"use client";

import React, { useState } from "react";
import HelloWorld from "./_components/HelloWorld";
import Button from "./_components/Button";
import Header from "./_components/_ui/Header";
import Reviews from "./_components/Reviews";
import RoomCode from "./_components/RoomCode";
import StatusImage from "@/app/components/_components/StatusImage";
import PillButtonGroup from "./_components/PillButtonGroup";
import RateButton from "./_components/RateButton";
import type { CustomMovie } from "../../types/movies";
import MovieCard from "./_components/MovieCard";
import ResultCard from "./_components/ResultCard";
import GenreSelector from "./_components/GenreSelector";

// SAMPLE MOVIE DATA for testing MovieForRating component - R.M.
const sampleMovie: CustomMovie = {
	title: "Avatar: Fire and Ash",
	description:
		"In the wake of the devastating war against the RDA and the loss of their eldest son, Jake Sully and Neytiri face a new threat on Pandora: the Ash People, a violent and power-hungry Na'vi tribe led by the ruthless Varang. Jake's family must fight for their survival and the future of Pandora in a conflict that pushes them to their emotional and physical limits.",
	poster_url:
		"https://image.tmdb.org/t/p/w500/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg",
	release_date: "2025-12-17",
	runtime: "162",
	genres: [12, 878, 18],
	imdb_id: "tt1630029",
	imdb_url: "https://www.imdb.com/title/tt1630029/",
	ratings: [
		{ Source: "Internet Movie Database", Value: "8.5" },
		{ Source: "Rotten Tomatoes", Value: "92%" },
		{ Source: "Metacritic", Value: "85" },
	],
	language: "en",
	director: "James Cameron",
	actors: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
};

const ComponentsPage = () => {
	const [guestCode, setGuestCode] = useState("");
	const [selected, setSelected] = useState("action");

	return (
		<div className="bg-primary">
			<h2 className="text-accent text-center">Components Page</h2>
			<div className="flex flex-col items-center gap-4 m-4">
				<Header />
				<GenreSelector />
				<ResultCard movie={sampleMovie} compatibilityScore={95} />
				<MovieCard movie={sampleMovie} />
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
