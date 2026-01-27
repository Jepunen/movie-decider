import { CustomMovie } from "./movies"

// Type for data on individual movies stored in redis sessions. Data is stored in redis as a map where structure is as follows:
// <K: movieID[string], V: score[number], count[number]
// score: average score given to movie
// count: number of scores given to movie. Used to calculate new average.
export type redisMovieData = {
  movieData: CustomMovie,
  score: number,
  count: number
}


// structure of data stored in redis
export type redisData = { 
  createdAt: string,
  sessionState: boolean,
  movies: Record<string, redisMovieData>
}


// provided by user request when updating movie preferences
// movieID: id of scored movie
// socre: user preference score
export type updateScoreType = {
  movie: CustomMovie,
  score: number
};
