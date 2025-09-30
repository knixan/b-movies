import { MovieDb, PersonResult } from "moviedb-promise";
import { MovieApi, PersonApi } from "./types";

const moviedb = new MovieDb("c0d3fc45d2f4922af3c27e30726b5daa");

// Constants to limit the number of results we get from TMDB
// so we don't make too many requests to their API.
// Probably should be environment variables but whatever
const NUMBER_OF_MOVIES = 6;
const NUMBER_OF_CREW = 5;
const NUMBER_OF_CAST = 10;
const NUMBER_OF_VOTES = 20;

// Had to expand PersonResult because it is defined
// in the JSON but not in the original interface
interface PersonResultWithDepartment extends PersonResult {
  known_for_department?: string;
}

// Returns a Movie list with all the details that are needed to add
// a bunch of movies to the database, it also contains genres for each movie
// which need to be handed seperatly in the database
export async function FindMoviesByDirectors(): Promise<MovieApi[]> {
  // Hardcoded a list of directors to search for
  // Because we have a B-movie shop, we want to focus on cult directors
  // that are known for their B-movies and not the big Hollywood directors
  const directorNames: string[] = [
    "Edward D. Wood Jr.",
    "William Castle",
    "Lloyd Kaufman",
    "Mario Bava",
    "Dario Argento",
    "Lucio Fulci",
    "Riccardo Freda",
    "Antonio Margheriti",
    "Umberto Lenzi",
    "Lloyd Kaufman",
    "Bert I. Gordon",
    "Don Dohler",
    "Sam Newfield",
  ];

  const directorIds: number[] = [];
  const movies: MovieApi[] = [];

  // Convert the directorName list to IDs for the most popular director of the query
  for (const name of directorNames) {
    const res = await moviedb.searchPerson({ query: name, page: 1 });

    // We have to filter by Writing as well because of how TMDB sometimes filter crew
    // Example: Edward D. Wood Jr. is known for writing but he also directed all his movies.
    if (res.results && res.results.length > 0) {
      const matches = res.results.filter(
        (person: PersonResultWithDepartment) =>
          person.name === name &&
          (person.known_for_department === "Directing" ||
            person.known_for_department === "Writing")
      );

      // Assumption made that the most popular person of the search will be on the first page
      const mostPopular = matches.reduce(
        (max, person) =>
          (person.popularity ?? 0) > (max.popularity ?? 0) ? person : max,
        matches[0]
      );

      if (mostPopular && mostPopular.id) {
        directorIds.push(mostPopular.id as number);
      }
    }
  }

  // For each director, find all the movies they have directed
  for (const id of directorIds) {
    const allCredits = await moviedb.personMovieCredits(id);
    const directedMovies = allCredits.crew?.filter(
      (credit) =>
        credit.department === "Directing" &&
        credit.job === "Director" &&
        credit.adult === false
    );

    // We take the NUMBER_OF_MOVIES most popular movies by the director,
    // with at least NUMBER_OF_VOTES votes to avoid weird edge cases
    if (directedMovies) {
      const topMovies = directedMovies
        .filter((movie) => (movie.vote_count ?? 0) >= NUMBER_OF_VOTES)
        .sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))
        .slice(0, NUMBER_OF_MOVIES);

      for (const topMovie of topMovies) {
        const movie = await moviedb.movieInfo(topMovie.id as number);

        // If the movie doesn't have a title for some reason we discard it.
        // Everything else is set as optional in the interface
        if (movie.title && movie.id) {
          movies.push({
            id: movie.id,
            title: movie.title,
            releaseDate: movie.release_date,
            popularity: movie.popularity,
            runtime: movie.runtime,
            budget: movie.budget,
            revenue: movie.revenue,
            overview: movie.overview,
            tagline: movie.tagline,
            votes: movie.vote_count,
            rating: movie.vote_average,
            genres: movie.genres,
            posterPath: movie.poster_path,
            backdropPath: movie.backdrop_path,
          });
        }
      }
    }
  }

  return movies;
}

// Returns the crew and cast for a specific movie
// with all the details that are needed to add them to the database.
// There is missing information from the credits endpoint,
// so we have to make additional requests to get the full person info.
// This means that we will only get a limited number of crew and cast members
// to avoid making too many requests to the API.
export async function FindCrewByMovieId(
  movieId: number
): Promise<{ crew: PersonApi[]; cast: PersonApi[] }> {
  const credits = await moviedb.movieCredits({ id: movieId });

  const cast: PersonApi[] = [];
  const crew: PersonApi[] = [];

  // We sort the cast by order and take the first NUMBER_OF_CAST members
  // because order is the field that defines the importance of the cast member in the movie
  const castSlice = credits.cast
    ? credits.cast
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .slice(0, NUMBER_OF_CAST)
    : [];
  for (const castMember of castSlice) {
    if (castMember.id && castMember.name) {
      cast.push({
        id: castMember.id,
        name: castMember.name,
        character: castMember.character,
        order: castMember.order,
        profilePath: castMember.profile_path,
      });
    }
  }

  // Ensure important roles (Director, Writer, Screenplay, Story, etc.) are included
  // in the crew list, then fill the rest with the most popular crew members.
  const importantJobs = new Set([
    "Director",
    "Writer",
    "Screenplay",
    "Story",
    "Screenwriter",
    "Author",
  ]);

  const crewList = credits.crew ?? [];

  // Allow the same person to appear multiple times for different jobs:
  const includedKeys = new Set<string>();
  const importantMembers: PersonApi[] = [];

  const importantJobsLower = new Set(
    Array.from(importantJobs).map((j) => j.toLowerCase())
  );

  // Helper functions to normalize job titles and create unique keys
  const normalizeJob = (j?: string) => (j ?? "").trim();
  const jobKey = (id: number, j?: string) =>
    `${id}:${normalizeJob(j).toLowerCase()}`;

  for (const c of crewList) {
    if (!c.id || !c.name) continue;
    const job = normalizeJob(c.job);
    const jobLower = job.toLowerCase();

    // match important jobs case-insensitively, or use department fallback
    const isImportant =
      importantJobsLower.has(jobLower) ||
      c.department === "Directing" ||
      /director/i.test(job);

    const key = jobKey(c.id as number, job);

    if (isImportant && !includedKeys.has(key)) {
      includedKeys.add(key);
      importantMembers.push({
        id: c.id,
        name: c.name,
        job: c.job,
        profilePath: c.profile_path,
      });
    }
  }

  // Then take the most popular remaining crew members until we reach NUMBER_OF_CREW
  const otherCandidates = crewList
    .filter(
      (c) =>
        c.id &&
        c.name &&
        !includedKeys.has(jobKey(c.id as number, normalizeJob(c.job)))
    )
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

  const finalCrew: PersonApi[] = [...importantMembers];

  for (const c of otherCandidates) {
    if (finalCrew.length >= NUMBER_OF_CREW) break;
    const key = jobKey(c.id as number, normalizeJob(c.job));
    if (includedKeys.has(key)) continue;
    finalCrew.push({
      id: c.id as number,
      name: c.name as string,
      job: c.job,
      profilePath: c.profile_path,
    });
    includedKeys.add(key);
  }

  // If there are fewer than NUMBER_OF_CREW but more important members than the limit,
  // truncate to the limit (keeps important ones first).
  crew.push(...finalCrew.slice(0, NUMBER_OF_CREW));

  return { crew, cast };
}

// This function fetches additional information about a person from TMDB
// in case it is missing in the database. It is supposed to be used on an
// individual basis when a user enters a person's page and we don't have
// all the information about them yet.
// This is needed to avoid making too many requests to the API when we first
// add a bunch of movies and their crew and cast to the database.
export async function FindExtraPersonInfo(
  personId: number
): Promise<PersonApi> {
  // Fetch additional information about a person from TMDB
  const personInfo = await moviedb.personInfo(personId);

  const person: PersonApi = {};

  // Let's make sure that the person we look for exists to avoid adding dead data
  if (personInfo.id && personInfo.name) {
    person.id = personInfo.id;
    person.name = personInfo.name;
    person.biography = personInfo.biography;
    person.birthday = personInfo.birthday;
    person.deathday = personInfo.deathday;
    person.profilePath = personInfo.profile_path;
  }

  return person;
}
