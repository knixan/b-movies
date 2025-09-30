//src\actions\genres.ts

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  createGenreSchema,
  updateGenreSchema,
  deleteGenreSchema,
  CreateGenreInput,
  UpdateGenreInput,
} from "@/lib/zod-schemas";
import { requireAdmin } from "@/lib/auth";

// Create a new genre
export async function createGenre(input: CreateGenreInput) {
  const validated = await createGenreSchema.parseAsync(input);
  const genre = await prisma.genre.create({ data: validated });
  revalidatePath("/admin/genres");
  return genre;
}

// Update existing genre
export async function updateGenre(input: UpdateGenreInput) {
  const validated = await updateGenreSchema.parseAsync(input);
  const genre = await prisma.genre.update({
    where: { id: validated.id },
    data: validated,
  });
  revalidatePath("/admin/genres");
  return genre;
}

// Delete a genre by id
export async function deleteGenre(id: number) {
  //Authorization
  await requireAdmin();

  const validated = await deleteGenreSchema.parseAsync({ id });
  await prisma.genre.delete({ where: { id: validated.id } });
  revalidatePath("/admin/genres");
}

// Fetch all genres
export async function getAllGenres() {
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });
  return genres;
}
