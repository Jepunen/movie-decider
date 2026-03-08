import type { redisData } from "@/types/redisData";
import type { Result } from "@/types/movies";

/**
 * Maps a raw vote value (2–5) to a 0–100 score.
 * Vote of 1 is a veto and handled separately — do not pass 1 here.
 */
export function transformVote(raw: number): number {
  const map: Record<number, number> = { 2: 25, 3: 50, 4: 75, 5: 100 };
  return map[raw] ?? 50;
}

/**
 * Calculates the veto-penalised compatibility score (0–100) for one movie.
 * Vetoes apply a cubic penalty: fewer non-veto voters → dramatically lower score.
 */
export function compatibilityScore(
  score: number,
  count: number,
  vetoes: number,
): number {
  const total = count + vetoes;
  if (total === 0) return 0;
  if (count === 0) return 0; // all votes were vetoes
  const vetoFactor = Math.pow(count / total, 3.5);
  return Math.round(Math.min(100, Math.max(0, score * vetoFactor)));
}

/**
 * Derives a sorted Result[] from session movie data.
 * Highest compatibility first.
 */
export function calculateResults(sessionData: redisData): Result[] {
  const results: Result[] = [];

  for (const imdbId in sessionData.movies) {
    const entry = sessionData.movies[imdbId];
    results.push({
      movie: entry.movieData,
      compatibility: compatibilityScore(
        entry.score,
        entry.count,
        entry.vetoes ?? 0,
      ),
    });
  }

  results.sort((a, b) => b.compatibility - a.compatibility);
  return results;
}
