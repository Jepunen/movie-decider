// app/api/movies/route.ts
import { changeSessionState } from "@/redis/redis";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

	changeSessionState(searchParams.get("roomCode") || "");

	return Response.json({ status: 200 });
}
