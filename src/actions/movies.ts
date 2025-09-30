"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  createMovieSchema,
  updateMovieSchema,
  deleteMovieSchema,
  updateMovieGenresSchema,
  CreateMovieInput,
  UpdateMovieInput,
} from "@/lib/zod-schemas";
import { requireAdmin } from "@/lib/auth";

export async function createMovie(formData: CreateMovieInput) {
  //Authorization
  await requireAdmin();

  const validated = await createMovieSchema.parseAsync(formData);

  const newMovie = await prisma.movie.create({
    data: {
      tmdbId: validated.tmdbId,
      title: validated.title,
      releaseDate: validated.releaseDate,
      runtime: validated.runtime,
      tagline: validated.tagline,
      overview: validated.overview,
      budget: validated.budget,
      revenue: validated.revenue,
      posterPath: validated.posterPath,
      backdropPath: validated.backdropPath,
      stock: validated.stock || 0,
      price: validated.price || 0,
    },
  });

  revalidatePath("/admin/movies");
  return newMovie;
}

export async function updateMovie(formData: UpdateMovieInput) {
  //Authorization
  await requireAdmin();

  const validated = await updateMovieSchema.parseAsync(formData);

  const updateMovie = await prisma.movie.update({
    where: { id: validated.id },
    data: {
      tmdbId: validated.tmdbId,
      title: validated.title,
      releaseDate: validated.releaseDate,
      runtime: validated.runtime,
      tagline: validated.tagline,
      overview: validated.overview,
      budget: validated.budget,
      revenue: validated.revenue,
      posterPath: validated.posterPath,
      backdropPath: validated.backdropPath,
      stock: validated.stock || 0,
      price: validated.price || 0,
    },
  });

  revalidatePath(`/movies/${validated.id}`);
  revalidatePath("/movies");
  return updateMovie;
}

export async function deleteMovie(id: number) {
  //Authorization
  await requireAdmin();

  const validated = await deleteMovieSchema.parseAsync({ id });

  await prisma.movie.delete({
    where: { id: validated.id },
  });

  revalidatePath("/movies");
}

export async function getAllMovies() {
  return await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateMovieGenresAction(formData: FormData) {
  await requireAdmin();

  const movieIdRaw = formData.get("movieId");
  const selected = formData.getAll("genreIds");

  // Convert to numbers
  const movieId = Number(movieIdRaw);
  const genreIds = selected.map((v) => Number(v));

  // Validate with Zod
  const validated = await updateMovieGenresSchema.parseAsync({
    movieId,
    genreIds,
  });

  await prisma.movie.update({
    where: { id: validated.movieId },
    data: {
      genres: {
        set: validated.genreIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath(`/movies/${validated.movieId}`);
  revalidatePath("/movies");
  revalidatePath("/admin/movies");
}

export async function searchMoviesByTitle(query: string, limit = 10) {
  const q = query.trim();
  if (!q) return [] as { id: number; title: string; subtitle?: number }[];

  const movies = await prisma.movie.findMany({
    where: { title: { contains: q, mode: "insensitive" } },
    orderBy: { title: "asc" },
    select: { id: true, title: true, releaseDate: true },
    take: Math.min(20, Math.max(1, limit)),
  });

  return movies.map((m) => ({
    id: m.id,
    title: m.title,
    subtitle: m.releaseDate ? new Date(m.releaseDate).getFullYear() : undefined,
  }));
}
