"use client";

import { CustomMovie } from "@/types/movies";
import { useMovies } from "@/lib/movies";

export default function test() {
	const { data: movies, isLoading, isError } = useMovies();

	if (isLoading) {
		return <div>Loading movies...</div>;
	}

	if (isError || !movies) {
		return <div>Error loading movies.</div>;
	}

	return (
		<div className="flex flex-col">
			<div className="flex justify-around gap-1 h-full flex-wrap">
				{movies.map((movie: CustomMovie) => {
					return (
						<div key={movie.imdb_id}>
							{movie.title}
							<br />
							{"ID: "}
							{movie.imdb_id}
							<br />
							{movie.ratings.length === 0 && (
								<p>No ratings found.</p>
							)}
							{movie.ratings.map((rating) => {
								return (
									<p key={rating.Source}>
										{rating.Source}: {rating.Value}
									</p>
								);
							})}
							{"Released: " + movie.release_date}
							<img
								src={
									movie.poster_url
										? movie.poster_url
										: "/placeholder.png"
								}
								alt={movie.title}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
