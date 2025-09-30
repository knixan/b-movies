"use client";

import type { Movie } from "@/generated/prisma";
import { updateMovie } from "@/actions/movies";
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
import { UpdateMovieInput, updateMovieSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UpdateMovieFormProps {
  movie: Movie;
}

export default function UpdateMovieForm({ movie }: UpdateMovieFormProps) {
  const form = useForm<UpdateMovieInput>({
    resolver: zodResolver(updateMovieSchema),
    defaultValues: {
      id: movie.id,
      tmdbId: movie.tmdbId ? Number(movie.tmdbId) : undefined,
      title: movie.title,
      tagline: movie.tagline ?? "",
      overview: movie.overview ?? "",
      releaseDate: movie.releaseDate ?? undefined,
      budget: movie.budget ? Number(movie.budget) : undefined,
      revenue: movie.revenue ? Number(movie.revenue) : undefined,
      runtime: movie.runtime ?? undefined,
      posterPath: movie.posterPath ?? "",
      backdropPath: movie.backdropPath ?? "",
      price: movie.price ?? undefined,
      stock: movie.stock ?? undefined,
    },
  });

  async function onSubmit(data: UpdateMovieInput) {
    try {
      await updateMovie(data);
      toast.success("Movie updated");
    } catch (error) {
      toast.error("Failed to update movie");
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="releaseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Release Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  onChange={(e) => {
                    const val = e.target.valueAsDate;
                    if (val) {
                      field.onChange(val);
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
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="overview"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Overview</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="runtime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Runtime (optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value?.toString() ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget (optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value?.toString() ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="revenue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Revenue (optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value?.toString() ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value?.toString() ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock (optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value?.toString() ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="posterPath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster Path ( /xxxxxxxxxx... )</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="backdropPath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backdrop Path ( /xxxxxxxxxx... )</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4 max-w-1/4">
          Update Movie
        </Button>
      </form>
    </Form>
  );
}
