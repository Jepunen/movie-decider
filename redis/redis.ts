import { redisData } from "@/types/requestData";
import { ok } from "assert";
import Redis from "ioredis";
import { json } from "stream/consumers";

declare global {
	var _redis: Redis | undefined;
}

export function getRedis(): Redis {
	if (!globalThis._redis) {
		globalThis._redis = new Redis({
			host: process.env.REDIS_HOST,
			port: Number(process.env.REDIS_PORT),
			lazyConnect: true,
		});
	}
	return globalThis._redis;
}

// Helper function to publish session updates
export async function publishSessionUpdate(sessionID: string, data: any): Promise<void> {
	const redis = getRedis();
	if (redis.status !== "ready") {
		await redis.connect();
	}
	const channelName = `session:${sessionID}:updates`;
	await redis.publish(channelName, JSON.stringify(data));
}

// Helper function to get session data
export async function getSessionData(sessionID: string): Promise<any> {
	const redis = getRedis();
	if (redis.status !== "ready") {
		await redis.connect();
	}
	const data = await redis.get(`session:${sessionID}`);
	return data ? JSON.parse(data) : null;
}

// Helper function to update session data
export async function updateSessionData(sessionID: string, data: any): Promise<void> {
	const redis = getRedis();
	if (redis.status !== "ready") {
		await redis.connect();
	}
	await redis.set(`session:${sessionID}`, JSON.stringify(data), "EX", 3600);
	
	// Publish the update to all subscribers
	await publishSessionUpdate(sessionID, data);
}

// Helper function to get state of session
export async function getSessionsState(sessionID: string) {
	const redis = getRedis();
	if (redis.status != "ready") {
			await redis.connect();
	}
	const rawData: string | null = await redis.get(`session:${sessionID}`)

	if (!rawData) {
			return "Session not found"
	}

	const sessionData: redisData = JSON.parse(rawData);
	return sessionData.sessionState;
}

// Helper function to change state of session
export async function changeSessionState(sessionID: string) {
	const redis = getRedis();
	if (redis.status != "ready") {
			await redis.connect();
	}
	const rawData: string | null = await redis.get(`session:${sessionID}`)
	if (!rawData) {
			return false
	}

	const redisData: redisData = JSON.parse(rawData)
	redisData.sessionState = !redisData.sessionState
	await redis.set(`session:${sessionID}`, JSON.stringify(redisData), 'EX', 3600)
	return true
}
