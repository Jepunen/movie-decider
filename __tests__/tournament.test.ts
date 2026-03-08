import { describe, it, expect } from "vitest";
import {
  shuffle,
  pickTournamentMovies,
  buildPairs,
  resolvePair,
  computeRankings,
  rankingsToResults,
} from "@/lib/tournament";
import type { CustomMovie } from "@/types/movies";

const makeMovie = (id: string): CustomMovie => ({
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

const movies = (ids: string[]) => ids.map(makeMovie);

// ─── shuffle ─────────────────────────────────────────────────────────

describe("shuffle", () => {
  it("returns same number of elements", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toHaveLength(arr.length);
  });

  it("does not mutate the original array", () => {
    const arr = [1, 2, 3];
    const original = [...arr];
    shuffle(arr);
    expect(arr).toEqual(original);
  });

  it("contains all original elements", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr).sort()).toEqual([...arr].sort());
  });
});

// ─── pickTournamentMovies ─────────────────────────────────────────────

describe("pickTournamentMovies", () => {
  it("returns at most 8 movies", () => {
    const pool = movies(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
    expect(pickTournamentMovies(pool)).toHaveLength(8);
  });

  it("returns all movies when pool has fewer than 8", () => {
    const pool = movies(["a", "b", "c"]);
    expect(pickTournamentMovies(pool)).toHaveLength(3);
  });

  it("returns empty array for empty pool", () => {
    expect(pickTournamentMovies([])).toHaveLength(0);
  });
});

// ─── buildPairs ───────────────────────────────────────────────────────

describe("buildPairs", () => {
  it("creates N/2 pairs from an even list", () => {
    expect(buildPairs(movies(["a", "b", "c", "d"]))).toHaveLength(2);
  });

  it("drops trailing odd movie", () => {
    expect(buildPairs(movies(["a", "b", "c"]))).toHaveLength(1);
  });

  it("pairs are in sequential order", () => {
    const ms = movies(["a", "b", "c", "d"]);
    const pairs = buildPairs(ms);
    expect(pairs[0][0].imdb_id).toBe("a");
    expect(pairs[0][1].imdb_id).toBe("b");
    expect(pairs[1][0].imdb_id).toBe("c");
    expect(pairs[1][1].imdb_id).toBe("d");
  });

  it("returns empty for empty input", () => {
    expect(buildPairs([])).toHaveLength(0);
  });
});

// ─── resolvePair ──────────────────────────────────────────────────────

describe("resolvePair", () => {
  const a = makeMovie("tt001");
  const b = makeMovie("tt002");

  it("picks movieA when it has more votes", () => {
    const votes = { "0:s1": "tt001", "0:s2": "tt001", "0:s3": "tt002" };
    const { winner } = resolvePair(votes, a, b);
    expect(winner.imdb_id).toBe("tt001");
  });

  it("picks movieB when it has more votes", () => {
    const votes = { "0:s1": "tt002", "0:s2": "tt002", "0:s3": "tt001" };
    const { winner } = resolvePair(votes, a, b);
    expect(winner.imdb_id).toBe("tt002");
  });

  it("tie-breaks to movieA", () => {
    const votes = { "0:s1": "tt001", "0:s2": "tt002" };
    const { winner } = resolvePair(votes, a, b);
    expect(winner.imdb_id).toBe("tt001");
  });

  it("reports loser votes correctly", () => {
    const votes = { "0:s1": "tt001", "0:s2": "tt001", "0:s3": "tt002" };
    const { loserVotes } = resolvePair(votes, a, b);
    expect(loserVotes).toBe(1);
  });
});

// ─── computeRankings ─────────────────────────────────────────────────

describe("computeRankings", () => {
  it("places champion at rank 1", () => {
    const champion = makeMovie("champion");
    const eliminated = [
      { movie: makeMovie("runner"), roundIndex: 2, votesReceived: 1 },
    ];
    const rankings = computeRankings(eliminated, champion, 3);
    expect(rankings[0].place).toBe(1);
    expect(rankings[0].movie.imdb_id).toBe("champion");
  });

  it("later-round losers rank higher than earlier-round losers", () => {
    const champion = makeMovie("champ");
    const eliminated = [
      { movie: makeMovie("early"), roundIndex: 0, votesReceived: 1 },
      { movie: makeMovie("late"), roundIndex: 2, votesReceived: 1 },
    ];
    const rankings = computeRankings(eliminated, champion, 3);
    const latePlace = rankings.find((r) => r.movie.imdb_id === "late")!.place;
    const earlyPlace = rankings.find((r) => r.movie.imdb_id === "early")!.place;
    expect(latePlace).toBeLessThan(earlyPlace);
  });

  it("within same round, more votes → better place", () => {
    const champion = makeMovie("champ");
    const eliminated = [
      { movie: makeMovie("fewer"), roundIndex: 1, votesReceived: 1 },
      { movie: makeMovie("more"), roundIndex: 1, votesReceived: 3 },
    ];
    const rankings = computeRankings(eliminated, champion, 2);
    const morePlaced = rankings.find((r) => r.movie.imdb_id === "more")!.place;
    const fewerPlaced = rankings.find((r) => r.movie.imdb_id === "fewer")!.place;
    expect(morePlaced).toBeLessThan(fewerPlaced);
  });

  it("total rankings length equals eliminated + 1 (champion)", () => {
    const champion = makeMovie("champ");
    const eliminated = [
      { movie: makeMovie("a"), roundIndex: 0, votesReceived: 0 },
      { movie: makeMovie("b"), roundIndex: 0, votesReceived: 0 },
      { movie: makeMovie("c"), roundIndex: 1, votesReceived: 0 },
    ];
    const rankings = computeRankings(eliminated, champion, 2);
    expect(rankings).toHaveLength(4);
  });
});

// ─── rankingsToResults ────────────────────────────────────────────────

describe("rankingsToResults", () => {
  it("first place gets 100% compatibility", () => {
    const rankings = [
      { place: 1, movie: makeMovie("a"), roundsWon: 3 },
      { place: 2, movie: makeMovie("b"), roundsWon: 2 },
    ];
    const results = rankingsToResults(rankings);
    expect(results.find((r) => r.movie.imdb_id === "a")!.compatibility).toBe(100);
  });

  it("last place gets 0% compatibility", () => {
    const rankings = [
      { place: 1, movie: makeMovie("a"), roundsWon: 3 },
      { place: 2, movie: makeMovie("b"), roundsWon: 2 },
      { place: 3, movie: makeMovie("c"), roundsWon: 1 },
    ];
    const results = rankingsToResults(rankings);
    expect(results.find((r) => r.movie.imdb_id === "c")!.compatibility).toBe(0);
  });

  it("single movie gets 100%", () => {
    const results = rankingsToResults([{ place: 1, movie: makeMovie("a"), roundsWon: 1 }]);
    expect(results[0].compatibility).toBe(100);
  });

  it("returns same number of results as rankings", () => {
    const rankings = [1, 2, 3, 4].map((place) => ({
      place,
      movie: makeMovie(`m${place}`),
      roundsWon: 3 - place,
    }));
    expect(rankingsToResults(rankings)).toHaveLength(4);
  });
});
