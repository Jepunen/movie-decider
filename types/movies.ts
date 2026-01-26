// https://developer.themoviedb.org/reference/discover-movie
export type DiscoverMovieParams = {
  // Certification filters
  certification?: string;
  "certification.gte"?: string;
  "certification.lte"?: string;
  certification_country?: string;

  // Flags
  include_adult?: boolean; // default: false
  include_video?: boolean; // default: false

  // Localization & pagination
  language?: string; // default: en-US
  region?: string;
  watch_region?: string;
  page?: number; // default: 1

  // Release dates
  primary_release_year?: number;
  "primary_release_date.gte"?: string; // YYYY-MM-DD
  "primary_release_date.lte"?: string;
  "release_date.gte"?: string;
  "release_date.lte"?: string;
  year?: number;

  // Sorting
  sort_by?:
    | "popularity.asc"
    | "popularity.desc"
    | "release_date.asc"
    | "release_date.desc"
    | "revenue.asc"
    | "revenue.desc"
    | "primary_release_date.asc"
    | "primary_release_date.desc"
    | "original_title.asc"
    | "original_title.desc"
    | "vote_average.asc"
    | "vote_average.desc"
    | "vote_count.asc"
    | "vote_count.desc";

  // Voting
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "vote_count.gte"?: number;
  "vote_count.lte"?: number;

  // Runtime
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;

  // People & companies
  with_cast?: string;
  with_crew?: string;
  with_people?: string;
  with_companies?: string;
  without_companies?: string;

  // Genres & keywords
  with_genres?: string;
  without_genres?: string;
  with_keywords?: string;
  without_keywords?: string;

  // Language & origin
  with_original_language?: string;
  with_origin_country?: string;

  // Release type
  with_release_type?: string; // comma or pipe separated values [1–6]

  // Watch providers
  with_watch_monetization_types?:
    | "flatrate"
    | "free"
    | "ads"
    | "rent"
    | "buy"
    | `${"flatrate" | "free" | "ads" | "rent" | "buy"},${string}`
    | `${"flatrate" | "free" | "ads" | "rent" | "buy"}|${string}`;

  with_watch_providers?: string;
  without_watch_providers?: string;
};

export type Movie = {
  title: string;
  description: string;
  poster_url: string;
  release_date: string;
  runtime: string;
  genres: number[];
  imdb_id: string;
  imdb_url: string;
  ratings: Array<{
    Source: string;
    Value: string;
  }>;
  language: string;
  director: string;
  actors: string;
};

export type Result = {
  movie: Movie;
  compatibility: number;
};

export type OMDBMovie = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
};

export type CustomMovie = {
  title: string;
  description: string;
  poster_url: string;
  release_date: string;
  runtime: string;
  genres: string;
  imdb_id: string;
  imdb_url: string;
  ratings: Array<{
    Source: string;
    Value: string;
  }>;
  language: string;
  director: string;
  actors: string;
};
