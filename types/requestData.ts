// Type for data on individual movies stored in redis sessions. Data is stored in redis as a map where structure is as follows:
// <K: movieID[string], V: score[number], count[number]
// score: average score given to movie
// count: number of scores given to movie. Used to calculate new average.
export type redisScoreType = {
  score: number,
  count: number
}

export type redisData = { 
  createdAt: string,
  sessionState: boolean,
  movies: Record<string, redisScoreType>
}


// provided by user request when updating movie preferences
// movieID: id of scored movie
// socre: user preference score
export type updateScoreType = {
  movieID: string,
  score: number
};
