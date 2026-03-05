// app/api/movies/route.ts
import { getMovies } from "@/lib/movies";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const movies = await getMovies({
        with_genres: searchParams.get("with_genres") ?? undefined,
        "primary_release_date.gte": searchParams.get("primary_release_date.gte") ?? undefined,
        "primary_release_date.lte": searchParams.get("primary_release_date.lte") ?? undefined,
    });

    return Response.json(movies);
}
