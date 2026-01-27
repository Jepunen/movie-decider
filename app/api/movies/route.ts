// app/api/movies/route.ts
import { getMovies } from "@/lib/movies";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);

	const movies = await getMovies({
		with_genres: searchParams.get("with_genres") ?? undefined,
	});

	return Response.json(movies);
}
