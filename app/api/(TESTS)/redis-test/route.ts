import redis from "@/redis/redis";
import { error } from "console";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		await redis.connect();
		const pong = await redis.ping();
		await redis.set("redis:test", "ok", "EX", 10);

		return NextResponse.json({
			status: "ok",
			ping: pong,
		});
	} catch (err) {
		return NextResponse.json(
			{
				status: "error",
				error: err instanceof Error ? err.message : "Unknown error",
			},
			{
				status: 500,
			}
		);
	}
}
