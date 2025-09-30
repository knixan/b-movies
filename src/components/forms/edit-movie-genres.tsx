"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateMovieGenresAction } from "@/actions/movies";

const FormSchema = z.object({
  genreIds: z.array(z.number()).min(1, "Select at least one genre."),
});

export function EditMovieGenres({
  movieId,
  allGenres,
  initialSelectedIds,
}: {
  movieId: number;
  allGenres: { id: number; name: string }[];
  initialSelectedIds: number[];
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      genreIds: initialSelectedIds ?? [],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("movieId", String(movieId));
        for (const id of data.genreIds) {
          fd.append("genreIds", String(id));
        }
        await updateMovieGenresAction(fd);
        toast.success("Genres updated");
      } catch (err) {
        console.error(err);
        toast.error("Failed to update genres");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="genreIds"
          render={({ field }) => (
            <FormItem>
              <div className="mb-2">
                <FormLabel className="text-base">Genres</FormLabel>
                <FormDescription>
                  Select the genres for this movie.
                </FormDescription>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {allGenres.map((g) => (
                  <FormItem
                    key={g.id}
                    className="flex flex-row items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(g.id)}
                        disabled={isPending}
                        onCheckedChange={(checked) => {
                          const isChecked = Boolean(checked);
                          const current = field.value ?? [];
                          const next = isChecked
                            ? [...current, g.id]
                            : current.filter((id) => id !== g.id);
                          field.onChange(next);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {g.name}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save genres"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
