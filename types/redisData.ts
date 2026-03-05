import { CustomMovie } from "./movies"
import { Result } from "./movies";

// Type for data on individual movies stored in redis sessions. Data is stored in redis as a map where structure is as follows:
// <K: movieID[string], V: score[number], count[number], vetoes[number]
// score: running average of transformed 0-100 values (bad=25, normal=50, good=75, best=100). Veto votes are excluded.
// count: number of non-veto votes contributed to the average.
// vetoes: number of hard-no (worst) votes. Used to apply a multiplicative penalty to the final score.
export type redisMovieData = {
  movieData: CustomMovie,
  score: number,
  count: number,
  vetoes?: number,
}


// structure of data stored in redis
export type redisData = {
  createdAt: string;
  sessionState: boolean;
  movies: Record<string, redisMovieData>;
  currentMovies?: CustomMovie[];
  results?: Result[]; // Add this
};


// provided by user request when updating movie preferences
// movieID: id of scored movie
// socre: user preference score
export type updateScoreType = {
  movie: CustomMovie,
  score: number
};
