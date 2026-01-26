import {
	DiscoverMovieParams,
	Movie,
	OMDBMovie,
	CustomMovie,
} from "@/types/movies";
import { useQuery } from "@tanstack/react-query";
import pLimit from "p-limit";

const CACHE_LENGTH = 86400; // 24 hours

// https://developer.themoviedb.org/reference/discover-movie
export async function getMovies(
	params: DiscoverMovieParams = {},
): Promise<CustomMovie[]> {
	console.log("getMovies called with params:", params);
	const url = new URL(process.env.TMDB_BASE_URL + "/discover/movie");
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: "Bearer " + process.env.TMDB_API_KEY,
		},
		next: { revalidate: CACHE_LENGTH }, // Cache for 24 hours
	};

	let queryString = new URLSearchParams();

	// Loop params and append to query string, ignore if none defined
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined) {
			queryString.append(key, String(value));
		}
	});

	const tmdbDiscoveryMovies = await fetch(
		url + "?" + queryString.toString(),
		options,
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));

	//console.log(tmdbDiscoveryMovies);

	// Take 10 random movies from the results
	const randomizedMovies = getRandomMovies(
		tmdbDiscoveryMovies.results,
		10,
		363731,
	);

	const limit = pLimit(5); // Limit concurrent requests to 5
	let outputMovies: CustomMovie[] = await Promise.all(
		randomizedMovies.map((movie: Movie) =>
			limit(async () => {
				console.log("Fetching details for movie:", movie.title);
				const omdbDetails: OMDBMovie = await getOMDBetails(movie.id);

				return {
					title: movie.title,
					description: movie.overview,
					poster_url:
						"https://image.tmdb.org/t/p/w200" + movie.poster_path,
					release_date: movie.release_date,
					runtime: omdbDetails.Runtime,
					genres: movie.genre_ids,
					imdb_id: omdbDetails.imdbID,
					imdb_url: `https://www.imdb.com/title/${omdbDetails.imdbID}/`,
					ratings: omdbDetails.Ratings,
					language: movie.original_language,
					director: omdbDetails.Director,
					actors: omdbDetails.Actors,
				};
			}),
		),
	);

	// console.log(outputMovies);

	return outputMovies;
}

function getRandomMovies(
	movies: Movie[],
	count: number,
	seed: number,
): Movie[] {
	if (count >= movies.length) {
		return movies;
	}

	const shuffled = shuffleWithSeed(movies, seed);
	return shuffled.slice(0, count);
}

function shuffleWithSeed<T>(array: T[], seed: number): T[] {
	const result = [...array];
	let currentIndex = result.length;

	while (currentIndex !== 0) {
		const randomIndex = Math.floor(seededRandom(seed) * currentIndex);
		seed++;

		currentIndex--;

		[result[currentIndex], result[randomIndex]] = [
			result[randomIndex],
			result[currentIndex],
		];
	}

	return result;
}

function seededRandom(seed: number) {
	let x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

// https://api.themoviedb.org/3/movie/{movie_id}
export async function getMovieDetails(movieId: number) {
	console.log("Fetching movie details for ID:", movieId);
	const url = new URL(process.env.TMDB_BASE_URL + "/movie/" + movieId);
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: "Bearer " + process.env.TMDB_API_KEY,
		},
		next: { revalidate: CACHE_LENGTH }, // Cache for 24 hours
	};

	const res = await fetch(url, options);

	if (!res.ok) {
		throw new Error("Failed to fetch movie details");
	}

	return await res.json();
}

// https://www.omdbapi.com/
export async function getOMDBetails(tmdb_id: number) {
	console.log("Fetching OMDB details for TMDB ID:", tmdb_id);
	const movieDetails = await getMovieDetails(tmdb_id);
	console.log("Movie details fetched:", movieDetails);
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
		next: { revalidate: CACHE_LENGTH }, // Cache for 24 hours
	};

	const res = await fetch(url, options);

	if (!res.ok) {
		throw new Error("Failed to fetch OMDB details");
	}

	return await res.json();
}

interface MovieQueryParams {
	with_genres?: number[];
}

export function useMovies(params: MovieQueryParams = {}, enabled = true) {
	return useQuery<CustomMovie[]>({
		queryKey: ["movies", params],
		queryFn: async () => {
			const genreParam = params.with_genres?.join("|");
			const res = await fetch(
				`/api/movies?with_genres=${genreParam ?? ""}`,
			);
			if (!res.ok) throw new Error("Failed to fetch movies");
			return res.json();
		},
		enabled, // only fetch when enabled
		staleTime: 1000 * 60 * 60 * 24,
	});
}
