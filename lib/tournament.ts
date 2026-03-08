import type { CustomMovie, Result } from "@/types/movies";
import type { TournamentPair, TournamentRanking } from "@/types/tournament";
import type { redisTournamentData } from "@/types/redisData";

/** Fisher-Yates shuffle — returns a new array, does not mutate the input. */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Pick up to 8 movies from the pool (shuffled so selection is random). */
export function pickTournamentMovies(movies: CustomMovie[]): CustomMovie[] {
  const pool = shuffle([...movies]);
  return pool.slice(0, Math.min(8, pool.length));
}

/** Create sequential 1v1 pairs: [0,1], [2,3], [4,5], [6,7]. Odd trailing movie is dropped. */
export function buildPairs(movies: CustomMovie[]): TournamentPair[] {
  const pairs: TournamentPair[] = [];
  for (let i = 0; i + 1 < movies.length; i += 2) {
    pairs.push([movies[i], movies[i + 1]]);
  }
  return pairs;
}

/**
 * Tally votes for a pair and return winner/loser.
 * Tie-breaks to movieA (first in bracket).
 */
export function resolvePair(
  votes: Record<string, string>,
  movieA: CustomMovie,
  movieB: CustomMovie,
): { winner: CustomMovie; loser: CustomMovie; loserVotes: number } {
  let aVotes = 0;
  let bVotes = 0;
  for (const winnerId of Object.values(votes)) {
    if (winnerId === movieA.imdb_id) aVotes++;
    else if (winnerId === movieB.imdb_id) bVotes++;
  }
  if (aVotes >= bVotes) {
    return { winner: movieA, loser: movieB, loserVotes: bVotes };
  }
  return { winner: movieB, loser: movieA, loserVotes: aVotes };
}

/**
 * Compute final 1→N rankings once the tournament is complete.
 * Eliminated movies are ordered by their round of elimination (latest first),
 * and within the same round by votes received (more = better placing).
 */
export function computeRankings(
  eliminatedMovies: redisTournamentData["eliminatedMovies"],
  champion: CustomMovie,
  totalRounds: number,
): TournamentRanking[] {
  const rankings: TournamentRanking[] = [
    { place: 1, movie: champion, roundsWon: totalRounds },
  ];

  // Group by the round they were knocked out
  const byRound = new Map<number, typeof eliminatedMovies>();
  for (const entry of eliminatedMovies) {
    if (!byRound.has(entry.roundIndex)) byRound.set(entry.roundIndex, []);
    byRound.get(entry.roundIndex)!.push(entry);
  }

  // Latest round losers get highest places (2nd, 3rd/4th, 5th–8th)
  const sortedRounds = [...byRound.keys()].sort((a, b) => b - a);
  let place = 2;
  for (const round of sortedRounds) {
    const group = byRound.get(round)!;
    // Higher votes in the losing match → better placing within the group
    group.sort((a, b) => b.votesReceived - a.votesReceived);
    for (const entry of group) {
      rankings.push({ place, movie: entry.movie, roundsWon: round });
      place++;
    }
  }

  return rankings;
}

/**
 * Convert tournament rankings to Result[] so the existing ResultsPage can render them.
 * Compatibility is linearly scaled: 1st = 100%, last = 0%.
 */
export function rankingsToResults(rankings: TournamentRanking[]): Result[] {
  const total = rankings.length;
  return rankings.map((r) => ({
    movie: r.movie,
    compatibility:
      total > 1 ? Math.round(((total - r.place) / (total - 1)) * 100) : 100,
  }));
}
