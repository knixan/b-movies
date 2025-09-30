"use server";

// These are API actions meant to be used with tmdb.ts, a wrapper for The Movie Database API.
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma";
import {
  FindCrewByMovieId,
  FindExtraPersonInfo,
  FindMoviesByDirectors,
} from "@/lib/tmdb";
import { Genre } from "moviedb-promise";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addMoviesAndCrewFromTmdb() {
  await requireAdmin();

  const movies = await FindMoviesByDirectors();

  // For each movie, create a new movie or update it (if it already exists),
  // then find the crew and cast and add them to the database with the movie
  for (const movie of movies) {
    // Just generate some random stock and price for the movie
    const stock = Math.floor(Math.random() * 100) + 1;
    const prices = [49, 59, 69, 79, 89, 99, 109, 119, 129];
    const price = prices[Math.floor(Math.random() * prices.length)];

    const crew = await FindCrewByMovieId(movie.id);

    const addedMovie = await prisma.movie.upsert({
      where: { tmdbId: movie.id },
      create: {
        tmdbId: BigInt(movie.id),
        title: movie.title,
        tagline: movie.tagline,
        overview: movie.overview,
        releaseDate: movie.releaseDate
          ? new Date(movie.releaseDate)
          : undefined,
        runtime: movie.runtime,
        budget: movie.budget ? BigInt(movie.budget) : undefined,
        revenue: movie.revenue ? BigInt(movie.revenue) : undefined,
        votes: movie.votes,
        rating: movie.rating,
        posterPath: movie.posterPath,
        backdropPath: movie.backdropPath,
        stock,
        price,
      },
      update: {
        tmdbId: BigInt(movie.id),
        title: movie.title,
        tagline: movie.tagline,
        overview: movie.overview,
        releaseDate: movie.releaseDate
          ? new Date(movie.releaseDate)
          : undefined,
        runtime: movie.runtime,
        budget: movie.budget,
        revenue: movie.revenue,
        votes: movie.votes,
        rating: movie.rating,
        posterPath: movie.posterPath,
        backdropPath: movie.backdropPath,
        stock,
        price,
      },
    });

    // If the movie has genres, add them to the movie
    if (movie.genres) {
      await addGenresToMovie(addedMovie.id, movie.genres);
    }

    console.log("Added Movie:", { addedMovie });

    for (const actor of crew.cast) {
      if (!actor.id || !actor.name) continue;
      const addedCastMember = await prisma.person.upsert({
        where: { tmdbId: actor.id },
        create: {
          tmdbId: BigInt(actor.id),
          name: actor.name,
          profilePath: actor.profilePath,
          biography: actor.biography,
          birthday: actor.birthday ? new Date(actor.birthday) : undefined,
          deathday: actor.deathday ? new Date(actor.deathday) : undefined,
        },
        update: {
          name: actor.name,
          profilePath: actor.profilePath,
          biography: actor.biography,
          birthday: actor.birthday ? new Date(actor.birthday) : undefined,
          deathday: actor.deathday ? new Date(actor.deathday) : undefined,
        },
      });

      // Link cast member to movie with their character
      await addMovieCrewEntry({
        movieId: addedMovie.id,
        personId: addedCastMember.id,
        role: Role.CAST,
        job: "Actor",
        character: actor.character,
        order: actor.order,
      });

      console.log("Added to Cast:", { addedCastMember });
    }

    for (const crewMember of crew.crew) {
      if (!crewMember.id || !crewMember.name) continue;
      const addedCrewMember = await prisma.person.upsert({
        where: { tmdbId: crewMember.id },
        create: {
          tmdbId: BigInt(crewMember.id),
          name: crewMember.name,
          profilePath: crewMember.profilePath,
          biography: crewMember.biography,
          birthday: crewMember.birthday
            ? new Date(crewMember.birthday)
            : undefined,
          deathday: crewMember.deathday
            ? new Date(crewMember.deathday)
            : undefined,
        },
        update: {
          name: crewMember.name,
          profilePath: crewMember.profilePath,
          biography: crewMember.biography,
          birthday: crewMember.birthday
            ? new Date(crewMember.birthday)
            : undefined,
          deathday: crewMember.deathday
            ? new Date(crewMember.deathday)
            : undefined,
        },
      });

      // Link crew member to movie with their job
      await addMovieCrewEntry({
        movieId: addedMovie.id,
        personId: addedCrewMember.id,
        role: Role.CREW,
        job: crewMember.job,
        character: crewMember.character,
        order: crewMember.order,
      });

      console.log("Added to Crew:", { addedCrewMember });
    }
  }
}

// Helper function to create or update a person
// and add them to a movie's crew or cast
async function addMovieCrewEntry({
  movieId,
  personId,
  role,
  job,
  character,
  order,
}: {
  movieId: number;
  personId: number;
  role: Role;
  job?: string;
  character?: string;
  order?: number;
}) {
  const jobNorm = job?.trim() || null;
  const charNorm = character?.trim() || null;

  const existing = await prisma.movieCrew.findFirst({
    where: {
      movieId,
      personId,
      role,
      job: jobNorm,
      character: charNorm,
    },
  });

  if (existing) {
    return await prisma.movieCrew.update({
      where: { id: existing.id },
      data: { order },
    });
  } else {
    return await prisma.movieCrew.create({
      data: {
        movieId,
        personId,
        role,
        job: jobNorm,
        character: charNorm,
        order: order ?? null,
      },
    });
  }
}

// Helper function to add genres to a movie. Note that this does
// not handle genre descriptions because it is not provided by the API
async function addGenresToMovie(movieId: number, genres: Genre[]) {
  if (!genres || genres.length === 0) return;

  // Filter out genres with empty or invalid names
  const validGenres = genres.filter(
    (genre): genre is Genre & { name: string } =>
      typeof genre.name === "string" && genre.name.trim() !== ""
  );

  if (validGenres.length === 0) return;

  await prisma.movie.update({
    where: { id: movieId },
    data: {
      genres: {
        connectOrCreate: validGenres.map((genre) => ({
          where: { name: genre.name },
          create: { name: genre.name },
        })),
      },
    },
  });
}

// This function fetches additional information about a person from TMDB
// in case it is missing in the database. It is supposed to be used on an
// individual basis when a user enters a person's page and we don't have
// all the information about them yet.
// This is needed to avoid making too many requests to the API when we first
// add a bunch of movies and their crew and cast to the database.
export async function addExtraPersonInfo(personId: number) {
  const person = await prisma.person.findUnique({
    where: { id: personId },
  });

  if (!person) return;
  if (!person.tmdbId) return;

  // Fetch additional information from TMDB
  const extraInfo = await FindExtraPersonInfo(Number(person.tmdbId));

  // Update person with extra information
  await prisma.person.update({
    where: { id: personId },
    data: {
      birthday: extraInfo.birthday ? new Date(extraInfo.birthday) : undefined,
      deathday: extraInfo.deathday ? new Date(extraInfo.deathday) : undefined,
      biography: extraInfo.biography,
    },
  });

  revalidatePath(`/person/${personId}`);
}
