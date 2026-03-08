/**
 * Merge host genres and any number of guest genre arrays into a unique set.
 */
export function mergeGenres(
  hostGenres: number[],
  guestGenreSets: number[][],
): number[] {
  return [...new Set([...hostGenres, ...guestGenreSets.flat()])];
}

/**
 * Merge multiple [start, end] year ranges into the widest possible range.
 * Returns undefined when the input list is empty.
 */
export function mergeYearRanges(
  ranges: [number, number][],
): [number, number] | undefined {
  if (ranges.length === 0) return undefined;
  return [
    Math.min(...ranges.map(([start]) => start)),
    Math.max(...ranges.map(([, end]) => end)),
  ];
}

/**
 * Build the TMDB discover-movie query params object from merged genres and
 * an optional year range.
 */
export function buildMovieParams(
  genres: number[],
  yearRange?: [number, number],
): Record<string, string> {
  const params: Record<string, string> = {};
  if (genres.length > 0) {
    params.with_genres = genres.join("|");
  }
  if (yearRange) {
    params["primary_release_date.gte"] = `${yearRange[0]}-01-01`;
    params["primary_release_date.lte"] = `${yearRange[1]}-12-31`;
  }
  return params;
}
