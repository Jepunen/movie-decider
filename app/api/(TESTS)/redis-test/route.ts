import { getRedis } from "@/redis/redis";

export async function GET() {
	try {
		const redis = getRedis();
		const pong = await redis.ping();
		await redis.set("redis:test", "ok", "EX", 10);

		return Response.json({
			status: 200,
			message: `${pong}`,
		});
	} catch (err) {
		return Response.json({
			status: 500,
			message: err instanceof Error ? err.message : "Unknown error",
		});
	}
}
