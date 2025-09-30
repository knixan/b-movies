"use client";

import { createMovie } from "@/actions/movies";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateMovieInput, createMovieSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateMovieForm() {
  const form = useForm<CreateMovieInput>({
    resolver: zodResolver(createMovieSchema),
    defaultValues: {
      tmdbId: undefined,
      title: "",
      releaseDate: undefined,
      tagline: "",
      overview: "",
      budget: undefined,
      revenue: undefined,
      runtime: undefined,
      backdropPath: "",
      posterPath: "",
      price: undefined,
      stock: undefined,
    },
  });

  async function onSubmit(data: CreateMovieInput) {
    try {
      await createMovie(data);
      toast.success("Movie created");
    } catch (error) {
      toast.error("Failed to create movie");
      console.error(error);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create Movie</CardTitle>
        <CardDescription>Enter details to add a new movie</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Button type="submit">Create Movie</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
