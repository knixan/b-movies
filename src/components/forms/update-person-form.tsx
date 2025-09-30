"use client";

import { updatePerson } from "@/actions/person";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Person } from "@/generated/prisma";
import { UpdatePersonInput, updatePersonSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UpdatePersonFormProps {
  person: Person;
}

export default function UpdatePersonForm({ person }: UpdatePersonFormProps) {
  const form = useForm<UpdatePersonInput>({
    resolver: zodResolver(updatePersonSchema),
    defaultValues: {
      id: person.id,
      tmdbId: person.tmdbId ? Number(person.tmdbId) : undefined,
      name: person.name ?? "",
      birthday: person.birthday ?? undefined,
      deathday: person.deathday ?? undefined,
      biography: person.biography ?? "",
      profilePath: person.profilePath ?? "",
    },
  });

  async function onSubmit(data: UpdatePersonInput) {
    // Convert all the empty strings to undefined so that
    // they don't overwrite existing values in the database
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) =>
        value === "" ? [key, undefined] : [key, value]
      )
    ) as UpdatePersonInput;

    try {
      await updatePerson(cleanedData);
      toast.success("Person updated");
    } catch (error) {
      toast.error("Failed to update person");
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="tmdbId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TMDB ID (optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value?.toString() ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthday (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  onChange={(e) => {
                    const tmp = e.target.valueAsDate;
                    if (tmp) {
                      field.onChange(tmp);
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                  value={field.value?.toISOString().split("T")[0] ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deathday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deathday (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  onChange={(e) => {
                    const tmp = e.target.valueAsDate;
                    if (tmp) {
                      field.onChange(tmp);
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                  value={field.value?.toISOString().split("T")[0] ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profilePath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile path (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Person</Button>
      </form>
    </Form>
  );
}
