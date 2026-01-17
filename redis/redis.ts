import Redis from "ioredis";

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
