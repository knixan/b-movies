"use server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createPersonSchema,
  CreatePersonInput,
  UpdatePersonInput,
  updatePersonSchema,
  deletePersonSchema,
} from "@/lib/zod-schemas";
import { revalidatePath } from "next/cache";

export async function createPerson(person: CreatePersonInput) {
  //Authorization
  await requireAdmin();

  const data = await createPersonSchema.parseAsync(person);

  const newPerson = await prisma.person.create({
    data: {
      tmdbId: data.tmdbId !== undefined ? Number(data.tmdbId) : undefined,
      name: data.name,
      birthday: data.birthday,
      deathday: data.deathday,
      biography: data.biography,
      profilePath: data.profilePath,
    },
  });

  revalidatePath("/admin/person");
  return newPerson;
}

export async function updatePerson(person: UpdatePersonInput) {
  //Authorization
  await requireAdmin();

  const data = await updatePersonSchema.parseAsync(person);

  const updatedPerson = await prisma.person.update({
    where: { id: data.id },
    data: {
      tmdbId: data.tmdbId !== undefined ? Number(data.tmdbId) : undefined,
      name: data.name,
      birthday: data.birthday,
      deathday: data.deathday,
      biography: data.biography,
      profilePath: data.profilePath,
    },
  });

  revalidatePath(`/person/${person.id}`);
  revalidatePath("/person");
  return updatedPerson;
}

export async function deletePerson(id: number) {
  await requireAdmin();
  const validated = await deletePersonSchema.parseAsync({ id });
  await prisma.person.delete({
    where: { id: validated.id },
  });
  revalidatePath("/person");
}

export async function getAllPersons() {
  const persons = await prisma.person.findMany();
  return persons;
}

export async function getPersonById(id: number) {
  const person = await prisma.person.findUnique({
    where: { id },
  });
  return person;
}

export async function getPersonByTmdbId(tmdbId: number) {
  const person = await prisma.person.findUnique({
    where: { tmdbId },
  });
  return person;
}

export async function getPersonsByName(name: string) {
  const persons = await prisma.person.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
  });
  return persons;
}

export default async function getPersonsByBirthday(birthday: Date) {
  return prisma.person.findMany({
    where: {
      birthday: birthday,
    },
  });
}

export async function listMoviesForPerson(personId: number) {
  return prisma.movieCrew.findMany({
    where: { personId },
    include: { movie: true },
    orderBy: [{ role: "asc" }, { order: "asc" }, { id: "asc" }],
  });
}
