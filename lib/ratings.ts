import { getMovieDetails } from "./movies";

// https://www.omdbapi.com/
export async function getOMDBDetails(tmdb_id: number) {
	const movieDetails = await getMovieDetails(tmdb_id);
	const url = new URL(
		`https://www.omdbapi.com/?i=${movieDetails.imdb_id}&apikey=` +
			process.env.OMDB_API_KEY,
	);
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: "Bearer " + process.env.TMDB_API_KEY,
		},
		next: { revalidate: 3600 }, // Cache for 1 hour
	};

	return await fetch(url, options)
		.then((res) => res.json())
		.catch((err) => console.error(err));
}
