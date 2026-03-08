import { CustomMovie } from "./movies"
import { Result } from "./movies";
import { TournamentPair, TournamentRanking } from "./tournament";

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

// Tournament data stored inside the session — the public-facing shape matches TournamentState.
// Additional internal fields (playerCount, allMovies, eliminatedMovies) are used only by the backend.
export type redisTournamentData = {
  status: "voting" | "complete";
  roundIndex: number;
  /** Current round pairs — same for all players */
  pairs: TournamentPair[];
  /** Number of connected players at game start */
  playerCount: number;
  /** All 8 movies chosen for this tournament, kept to build next-round pairs */
  allMovies: CustomMovie[];
  /** Movies knocked out each round, with vote context for ranking within the group */
  eliminatedMovies: Array<{ movie: CustomMovie; roundIndex: number; votesReceived: number }>;
  /** Populated once status === "complete" */
  rankings?: TournamentRanking[];
};

// structure of data stored in redis
export type redisData = {
  createdAt: string;
  sessionState: boolean;
  gameMode?: "classic" | "tournament";
  movies: Record<string, redisMovieData>;
  currentMovies?: CustomMovie[];
  results?: Result[];
  tournament?: redisTournamentData;
};


// provided by user request when updating movie preferences
// movieID: id of scored movie
// socre: user preference score
export type updateScoreType = {
  movie: CustomMovie,
  score: number
};
