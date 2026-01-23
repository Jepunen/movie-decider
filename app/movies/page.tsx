import { getMovies } from "@/lib/movies";
import { getOMDBDetails } from "@/lib/ratings";
import { Movie, OMBDMovie } from "@/types/movies";

export default async function test() {
	const movies = await getMovies();
	const rating: OMBDMovie = await getOMDBDetails(movies.results[5].id);
	return (
		<div className="flex flex-col">
			<div className="flex justify-around gap-1 h-full flex-wrap">
				{movies.results.map((movie: Movie) => {
					return (
						<p key={movie.id}>
							{movie.title}
							<br />
							{" ID: "}
							{movie.id}
							<br />
							{"Rating: " + Number(movie.vote_average.toFixed(1))}
							<br />
							{"Released: " + movie.release_date}
							<img
								src={
									movie.poster_path
										? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
										: "/placeholder.png"
								}
								alt={movie.title}
							/>
						</p>
					);
				})}
			</div>
			<div className="pt-36 mx-auto pb-36">
				{rating.Title} ({rating.Year})
				{rating.Ratings.map((source: OMBDMovie["Ratings"][number]) => (
					<p key={source.Source}>
						{source.Source}: {source.Value}
					</p>
				))}
			</div>
		</div>
	);
}
