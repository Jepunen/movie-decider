//  This file handles backend logic for creating a new session.
// workflow: create session ID, store in Redis, return to client
// Client will then establish WebSocket connection using this sessionID

import { randomInt } from "crypto";
import { getRedis } from "@/redis/redis";

type ResponseData = {
  sessionID: number;
  message?: string;
}

export async function POST(req: Request) {
  try {
    const redis = getRedis();
    
    // Ensure Redis is connected
    if (redis.status !== "ready") {
      await redis.connect();
    }
    
    // Generate a unique session ID
    const sessionID = randomInt(100000, 999999);
    
    // Initialize session in Redis with empty data
    await redis.set(
      `session:${sessionID}`,
      JSON.stringify({ 
        createdAt: new Date().toISOString(),
        movies: [],
        participants: []
      }),
      // Set expiration to 1h (3600 seconds)
      "EX",
      3600
    );
    
    const response: ResponseData = {
      message: "Session created successfully",
      sessionID
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    console.log(error)
    return Response.json(
      { 
        message: "Failed to create session" 
      },
      { status: 500 }
    );
  }
}
