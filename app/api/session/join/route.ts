//  This file handles backend logic for joining an existing session.
// workflow: validate sessionID exists in Redis, return success/failure
// Client will then establish WebSocket connection using this sessionID

import { getSessionData } from "@/redis/redis";

type RequestBody = {
  sessionID: string;
}

type ResponseData = {
  sessionID?: string;
  message: string;
  sessionData?: any;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const sessionID: string | undefined = body.sessionID;

    // Validate sessionID is provided
    if (!sessionID) {
      return Response.json(
        {
          message: "sessionID is required" 
        } as ResponseData,
        { status: 400 }
      );
    }

    // Check if session exists in Redis
    const sessionData = await getSessionData(sessionID);

    if (!sessionData) {
      return Response.json(
        { 
          message: "Session not found or has expired" 
        } as ResponseData,
        { status: 404 }
      );
    }

    // Session exists, return success
    const response: ResponseData = {
      sessionID,
      message: "Session found. You can now connect via WebSocket.",
      sessionData
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    return Response.json(
      { 
        message: "Failed to join session" 
      } as ResponseData,
      { status: 500 }
    );
  }
}
