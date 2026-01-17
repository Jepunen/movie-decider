import Redis from "ioredis";

declare global {
	var redis: Redis | undefined;
}

const redis: Redis =
	globalThis.redis ??
	new Redis({
		host: process.env.REDIS_HOST,
		port: Number(process.env.REDIS_PORT),
	});

if (!globalThis.redis) {
	globalThis.redis = redis;
}
export default redis;
