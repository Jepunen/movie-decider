import { getSessionData, updateSessionData } from "@/redis/redis";
import { CustomMovie } from "@/types/movies";

type RequestBody = {
  sessionID: string;
  movies: CustomMovie[];
};

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { sessionID, movies } = body;

    if (!sessionID) {
      return Response.json(
        { message: "sessionID is required" },
        { status: 400 }
      );
    }

    // Get current session data
    const sessionData = await getSessionData(sessionID);

    if (!sessionData) {
      return Response.json(
        { message: "Session not found" },
        { status: 404 }
      );
    }

    // Update session with new state and movies
    sessionData.sessionState = true;
    sessionData.currentMovies = movies; // Store movies in session

    // This will update Redis AND publish to all subscribers
    await updateSessionData(sessionID, sessionData);

    return Response.json(
      { message: "Game started successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error starting game:", error);
    return Response.json(
      { message: "Failed to start game" },
      { status: 500 }
    );
  }
}
