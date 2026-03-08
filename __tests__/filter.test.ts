import { describe, it, expect } from "vitest";
import { mergeGenres, mergeYearRanges, buildMovieParams } from "@/lib/filter";

describe("mergeGenres", () => {
  it("returns host genres when no guests", () => {
    expect(mergeGenres([1, 2], [])).toEqual([1, 2]);
  });

  it("merges host and guest genres into unique set", () => {
    expect(mergeGenres([1, 2], [[2, 3], [3, 4]])).toEqual([1, 2, 3, 4]);
  });

  it("returns empty array when all inputs are empty", () => {
    expect(mergeGenres([], [])).toEqual([]);
  });

  it("deduplicates across multiple guest sets", () => {
    const result = mergeGenres([10], [[10, 20], [20, 30]]);
    expect(result).toEqual([10, 20, 30]);
  });
});

describe("mergeYearRanges", () => {
  it("returns undefined for empty input", () => {
    expect(mergeYearRanges([])).toBeUndefined();
  });

  it("returns the single range unchanged", () => {
    expect(mergeYearRanges([[2000, 2010]])).toEqual([2000, 2010]);
  });

  it("merges to widest possible range", () => {
    expect(mergeYearRanges([[2000, 2010], [1990, 2005], [2008, 2020]])).toEqual([1990, 2020]);
  });

  it("handles identical ranges", () => {
    expect(mergeYearRanges([[2000, 2010], [2000, 2010]])).toEqual([2000, 2010]);
  });
});

describe("buildMovieParams", () => {
  it("returns empty object when no genres and no year range", () => {
    expect(buildMovieParams([])).toEqual({});
  });

  it("sets with_genres using pipe separator", () => {
    const params = buildMovieParams([28, 12]);
    expect(params.with_genres).toBe("28|12");
  });

  it("sets release date params from year range", () => {
    const params = buildMovieParams([], [2000, 2010]);
    expect(params["primary_release_date.gte"]).toBe("2000-01-01");
    expect(params["primary_release_date.lte"]).toBe("2010-12-31");
  });

  it("sets both genres and year range together", () => {
    const params = buildMovieParams([28], [2005, 2015]);
    expect(params.with_genres).toBe("28");
    expect(params["primary_release_date.gte"]).toBe("2005-01-01");
    expect(params["primary_release_date.lte"]).toBe("2015-12-31");
  });

  it("omits year range when not provided", () => {
    const params = buildMovieParams([1]);
    expect(params["primary_release_date.gte"]).toBeUndefined();
    expect(params["primary_release_date.lte"]).toBeUndefined();
  });
});
