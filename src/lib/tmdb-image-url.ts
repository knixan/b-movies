import { BackdropSize, PosterSize, ProfileSize } from "./types";

/* These functions need a path which should have been provided by the
   TMDB API, and the PosterSize and BackdropSize values are the valid
   sizes that TMDB supports for each image type. They have a default
   value provided which can be used if unsure. */

// Example usage: getPosterUrl("/path/to/poster.jpg", "w500");
export function getPosterUrl(
  path: string | undefined | null,
  size: PosterSize = "w500"
): string | undefined {
  if (!path) return undefined;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getBackdropUrl(
  path: string | undefined | null,
  size: BackdropSize = "w1280"
): string | undefined {
  if (!path) return undefined;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getProfileUrl(
  path: string | undefined | null,
  size: ProfileSize = "w185"
): string | undefined {
  if (!path) return undefined;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
