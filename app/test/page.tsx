import { getMovies } from "@/lib/movies";
import { Movie } from "@/types/movies";

export default async function test() {
	const movies = await getMovies();
	return (
		<div className="flex justify-around gap-1 h-full flex-wrap">
			{movies.results.map((movie: Movie) => {
				return (
					<p key={movie.id}>
						{movie.title}{" "}
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
	);
}
