/**
 * Represents a movie returned by TMDB.
 * @typedef {Object} Movie
 * @property {boolean} adult - Whether the movie is marked as adult content.
 * @property {string|null} backdrop_path - Backdrop image path (e.g. "/ebyxeBh56QNXxSJgTnmz7fXAlwk.jpg").
 * @property {number[]} genre_ids - List of genre IDs.
 * @property {number} id - TMDB movie ID.
 * @property {string} original_language - Original language code (e.g. "en").
 * @property {string} original_title - Original movie title.
 * @property {string} overview - Movie synopsis.
 * @property {number} popularity - Popularity score.
 * @property {string|null} poster_path - Poster image path.
 * @property {string} release_date - Release date in YYYY-MM-DD format.
 * @property {string} title - Localized title.
 * @property {boolean} video - Whether this is a video entry.
 * @property {number} vote_average - Average user rating.
 * @property {number} vote_count - Number of votes.
 */

/**
 * TMDB paginated response wrapper.
 * @typedef {Object} TMDBPaginatedResponse
 * @property {number} page - Current page number.
 * @property {Movie[]} results - List of movies.
 * @property {number} total_pages - Total number of pages available.
 * @property {number} total_results - Total number of results.
 */

/**
 * Standard API success response.
 * @typedef {Object} ApiSuccessResponse
 * @property {number} status - HTTP-like status code.
 * @property {TMDBPaginatedResponse} data - Payload returned from TMDB.
 */

/**
 * Standard API error response.
 * @typedef {Object} ApiErrorResponse
 * @property {number} status - HTTP status code.
 * @property {string} error - Error message.
 */

// https://developer.themoviedb.org/reference/discover-movie

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const url = new URL(process.env.TMDB_BASE_URL + "/discover/movie");
		const options = {
			method: "GET",
			headers: {
				accept: "application/json",
				Authorization: "Bearer " + process.env.TMDB_API_KEY,
			},
		};

		const TMDBResponse = await fetch(
			url + "?" + req.nextUrl.searchParams.toString(),
			options
		)
			.then((res) => res.json())
			.catch((err) => console.error(err));

		return Response.json({
			status: 200,
			data: TMDBResponse,
		});
	} catch (err) {
		return Response.json(
			{
				status: 500,
				error: err instanceof Error ? err.message : "Unknown error",
			},
			{
				status: 500,
			}
		);
	}
}
