"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { linkPersonToMovieSchema } from "@/lib/zod-schemas";
import type { Role } from "@/generated/prisma";
import { requireAdmin } from "@/lib/auth";

export async function linkPersonToMovieAction(formData: FormData) {
  await requireAdmin();

  const data = await linkPersonToMovieSchema.parseAsync({
    personId: formData.get("personId"),
    movieId: formData.get("movieId"),
    role: formData.get("role"),
    job: formData.get("job") ?? undefined,
    character: formData.get("character") ?? undefined,
    order: formData.get("order") ?? undefined,
  });

  const role: Role = data.role as Role;
  const job = data.job?.trim() || null;
  const character = data.character?.trim() || null;

  // Using findFirst because we cannot use findUnique with a composite including nullable fields
  const existing = await prisma.movieCrew.findFirst({
    where: {
      movieId: data.movieId,
      personId: data.personId,
      role,
      job,
      character,
    },
  });

  let result;
  if (existing) {
    result = await prisma.movieCrew.update({
      where: { id: existing.id },
      data: { order: data.order ?? existing.order ?? null },
    });
  } else {
    result = await prisma.movieCrew.create({
      data: {
        movieId: data.movieId,
        personId: data.personId,
        role,
        job,
        character,
        order: data.order ?? null,
      },
    });
  }

  revalidatePath(`/movies/${data.movieId}`);
  revalidatePath(`/person/${data.personId}`);
  revalidatePath(`/admin/person`);
  return result;
}

export async function unlinkPersonFromMovieAction(formData: FormData) {
  await requireAdmin();

  const parsed = await linkPersonToMovieSchema
    .partial({ order: true })
    .parseAsync({
      personId: formData.get("personId"),
      movieId: formData.get("movieId"),
      role: formData.get("role"),
      job: formData.get("job") ?? undefined,
      character: formData.get("character") ?? undefined,
    });

  const role: Role = parsed.role as Role;
  const job = parsed.job?.trim() || null;
  const character = parsed.character?.trim() || null;

  const existing = await prisma.movieCrew.findFirst({
    where: {
      movieId: parsed.movieId!,
      personId: parsed.personId!,
      role,
      job,
      character,
    },
  });

  if (existing) {
    await prisma.movieCrew.delete({ where: { id: existing.id } });
  }

  revalidatePath(`/movies/${parsed.movieId}`);
  revalidatePath(`/person/${parsed.personId}`);
  revalidatePath(`/admin/person`);
}
