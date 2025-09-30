import { Genre } from "moviedb-promise";

export interface MovieApi {
  id: number;
  title: string;
  releaseDate?: string;
  popularity?: number;
  runtime?: number; // In minutes
  budget?: number;
  revenue?: number;
  overview?: string;
  tagline?: string;
  votes?: number;
  rating?: number;

  genres?: Genre[];

  posterPath?: string;
  backdropPath?: string;

  stock?: number;
  price?: number;
}

export interface PersonApi {
  id?: number;
  name?: string;
  biography?: string;
  birthday?: string | null;
  deathday?: string | null;

  profilePath?: string | null;

  // Role-specific fields
  character?: string; // For cast
  job?: string; // For crew
  order?: number; // For cast
}

export type PosterSize =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original";

export type BackdropSize = "w300" | "w780" | "w1280" | "original";

export type ProfileSize = "w45" | "w185" | "h632" | "original";
