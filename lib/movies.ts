import { DiscoverMovieParams } from "@/types/movies";

// https://developer.themoviedb.org/reference/discover-movie
export async function getMovies(params: DiscoverMovieParams = {}) {
	const url = new URL(process.env.TMDB_BASE_URL + "/discover/movie");
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: "Bearer " + process.env.TMDB_API_KEY,
		},
		next: { revalidate: 3600 }, // Cache for 1 hour
	};

	let queryString = new URLSearchParams();

	// Loop params and append to query string, ignore if none defined
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined) {
			queryString.append(key, String(value));
		}
	});

	return await fetch(url + "?" + queryString.toString(), options)
		.then((res) => res.json())
		.catch((err) => console.error(err));
}
