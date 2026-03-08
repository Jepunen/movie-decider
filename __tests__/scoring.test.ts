import { describe, it, expect } from "vitest";
import { transformVote, compatibilityScore, calculateResults } from "@/lib/scoring";
import type { redisData } from "@/types/redisData";

describe("transformVote", () => {
  it("maps 2 → 25", () => expect(transformVote(2)).toBe(25));
  it("maps 3 → 50", () => expect(transformVote(3)).toBe(50));
  it("maps 4 → 75", () => expect(transformVote(4)).toBe(75));
  it("maps 5 → 100", () => expect(transformVote(5)).toBe(100));
  it("defaults unknown values to 50", () => expect(transformVote(99)).toBe(50));
});

describe("compatibilityScore", () => {
  it("returns 0 when total votes is 0", () => {
    expect(compatibilityScore(0, 0, 0)).toBe(0);
  });

  it("returns 0 when all votes are vetoes", () => {
    expect(compatibilityScore(100, 0, 3)).toBe(0);
  });

  it("returns full score when there are no vetoes", () => {
    expect(compatibilityScore(100, 3, 0)).toBe(100);
  });

  it("applies veto penalty — one veto out of two total reduces score", () => {
    const score = compatibilityScore(100, 1, 1);
    // vetoFactor = (1/2)^3.5 ≈ 0.0884 → score ≈ 9
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(50);
  });

  it("clamps result to 0–100", () => {
    const score = compatibilityScore(200, 5, 0);
    expect(score).toBe(100);
  });
});

describe("calculateResults", () => {
  const makeSession = (movies: redisData["movies"]): redisData => ({
    createdAt: "2024-01-01",
    sessionState: true,
    movies,
  });

  const movie = (id: string) => ({
    imdb_id: id,
    title: `Movie ${id}`,
    poster_path: null,
    backdrop_path: null,
    overview: "",
    release_date: "2020-01-01",
    vote_average: 7,
    genres: [],
    runtime: 120,
    tagline: "",
  });

  it("returns empty array for session with no movies", () => {
    const results = calculateResults(makeSession({}));
    expect(results).toEqual([]);
  });

  it("sorts results by compatibility descending", () => {
    const session = makeSession({
      tt001: { movieData: movie("tt001"), score: 25, count: 1, vetoes: 0 },
      tt002: { movieData: movie("tt002"), score: 100, count: 1, vetoes: 0 },
    });
    const results = calculateResults(session);
    expect(results[0].movie.imdb_id).toBe("tt002");
    expect(results[1].movie.imdb_id).toBe("tt001");
  });

  it("includes all movies in results", () => {
    const session = makeSession({
      tt001: { movieData: movie("tt001"), score: 50, count: 2, vetoes: 0 },
      tt002: { movieData: movie("tt002"), score: 75, count: 2, vetoes: 0 },
      tt003: { movieData: movie("tt003"), score: 100, count: 2, vetoes: 0 },
    });
    expect(calculateResults(session)).toHaveLength(3);
  });

  it("applies veto penalty in full pipeline", () => {
    const session = makeSession({
      tt001: { movieData: movie("tt001"), score: 100, count: 2, vetoes: 0 },
      tt002: { movieData: movie("tt002"), score: 100, count: 1, vetoes: 1 },
    });
    const results = calculateResults(session);
    expect(results[0].movie.imdb_id).toBe("tt001");
    expect(results[0].compatibility).toBeGreaterThan(results[1].compatibility);
  });
});
