/**
 * 
 * @returns json:
 * {
 * 	status: integer,
 * 	data: {
 * 		page: integer,
 * 		results: [
 * 		{
			"adult": 				boolean,
			"backdrop_path": 		string, ("/ebyxeBh56QNXxSJgTnmz7fXAlwk.jpg")
			"genre_ids": 			[integer, ...],
			"id": 					integer,
			"original_language":	string, ("en")
			"original_title":		string,
			"overview": 			string,
			"popularity":			float,
			"poster_path": 			string, ("/pHpq9yNUIo6aDoCXEBzjSolywgz.jpg")
			"release_date":			string, ("2025-11-05")
			"title": 				string,
			"video": 				boolean,
			"vote_average":			float,
			"vote_count":  			integer
      	},
		* 	...],
 * 		total_pages:   integer,
 * 		total_results: integer
 * 	}
 * }
 */
export async function GET() {
	try {
		const url = new URL(process.env.TMDB_BASE_URL + "/discover/movie");
		const params = new URLSearchParams({
			sort_by: "popularity.desc",
		}).toString();

		const options = {
			method: "GET",
			headers: {
				accept: "application/json",
				Authorization: "Bearer " + process.env.TMDB_API_KEY,
			},
		};

		const TMDBResponse = await fetch(url + "?" + params, options)
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
