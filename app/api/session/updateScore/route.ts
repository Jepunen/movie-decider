import { escape } from "querystring";
import { updateSessionData, getSessionData } from "@/redis/redis";

// Define form of data fetched from redis
type sessionDataType = {
  createdAt: string;
  movies: Record<string, {score: number, count: number}>;
}

// Structure of expected request body
type requestBody = {
  sessionID: string,
  movieID: string,
  score: string
}


export async function POST(req: Request) {
  try {
    // Extraxt reques data
    const body: requestBody = await req.json();
    // Escape user input

    const sessionID: string = escape(body.sessionID);
    const movieID: string = escape(body.movieID);
    const userScore: number = Number(escape(body.score));

    // fetch current session data from redis
    const sessionData: sessionDataType = await getSessionData(sessionID)
    if (!sessionData) {
      return Response.json(
        {"Message": "Session not found"},
        {status: 404}
      )
    }

    // check if updated movie has a score
    const currentMovieData = sessionData.movies[movieID];
    if (!currentMovieData) {
      // New movie, initialize with score and count of 1
      sessionData.movies[movieID] = {score: userScore, count: 1};
    } else {
      // Existing movie, calculate new average score
      const totalScore = currentMovieData.score * currentMovieData.count + userScore;
      const newCount = currentMovieData.count + 1;
      sessionData.movies[movieID] = {
        score: totalScore / newCount,
        count: newCount
      };
    }
    // Save updated data back to Redis
    await updateSessionData(sessionID, sessionData)

    return Response.json({data: sessionData.movies}, {status: 200})

  } catch (error: any) {
    console.log(error)
    return Response.json(
      {"message": error},
      {status: 500}
    )
  }
}
