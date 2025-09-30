"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { linkPersonToMovieAction } from "@/actions/movieCrew";
import { searchMoviesByTitle } from "@/actions/movies";
import { roleEnum, linkPersonToMovieSchema } from "@/lib/zod-schemas";

type FormSchema = z.infer<typeof linkPersonToMovieSchema>;

export function LinkPersonToMovieForm({ personId }: { personId: number }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [movieQuery, setMovieQuery] = useState("");
  const [options, setOptions] = useState<
    { id: number; title: string; subtitle?: number }[]
  >([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(linkPersonToMovieSchema),
    defaultValues: {
      personId,
      movieId: 0,
      role: "CAST",
      job: "Actor",
      character: "",
      order: undefined,
    },
  });

  const role = form.watch("role");

  useEffect(() => {
    if (role === "CAST") {
      form.setValue("job", "Actor");
    } else {
      form.setValue("job", "");
      form.setValue("character", "");
    }
  }, [role, form]);

  useEffect(() => {
    let active = true;
    if (movieQuery.trim() === "") {
      setOptions([]);
      return;
    }
    setLoadingOptions(true);
    searchMoviesByTitle(movieQuery, 10)
      .then((data) => {
        if (!active) return;
        setOptions(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!active) return;
        setLoadingOptions(false);
      });
    return () => {
      active = false;
    };
  }, [movieQuery]);

  function onSubmit(values: FormSchema) {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("personId", String(values.personId));
        fd.set("movieId", String(values.movieId));
        fd.set("role", values.role);
        if (values.role === "CAST") {
          fd.set("job", "Actor"); // always enforce for CAST
        } else if (values.job) {
          fd.set("job", values.job);
        }
        if (values.role === "CAST" && values.character) {
          fd.set("character", values.character);
        }
        if (values.order !== undefined && values.order !== null)
          fd.set("order", String(values.order));

        await linkPersonToMovieAction(fd);
        toast.success("Linked successfully");
        form.reset({ ...values, movieId: 0, character: "", order: undefined });
      } catch (e) {
        console.error(e);
        toast.error("Failed to link");
      }
    });
  }

  const selectedMovie = options.find((o) => o.id === form.getValues("movieId"));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="movieId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Movie</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                  >
                    {selectedMovie ? (
                      <span>
                        {selectedMovie.title}
                        {selectedMovie.subtitle
                          ? ` (${selectedMovie.subtitle})`
                          : ""}
                      </span>
                    ) : (
                      "Search and select a movie"
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[320px]">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search movies..."
                      value={movieQuery}
                      onValueChange={setMovieQuery}
                    />
                    <CommandList>
                      {loadingOptions ? (
                        <CommandEmpty>Loading...</CommandEmpty>
                      ) : (
                        <CommandEmpty>No movies found.</CommandEmpty>
                      )}
                      <CommandGroup>
                        {options.map((opt) => (
                          <CommandItem
                            key={opt.id}
                            value={String(opt.id)}
                            onSelect={() => {
                              form.setValue("movieId", opt.id, {
                                shouldValidate: true,
                              });
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                opt.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <span>
                              {opt.title}
                              {opt.subtitle ? ` (${opt.subtitle})` : ""}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <div className="flex gap-2">
                {roleEnum.options.map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    variant={field.value === opt ? "default" : "outline"}
                    onClick={() => field.onChange(opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
              <FormDescription>
                Select CAST for actors, CREW for behind-the-scenes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {role === "CREW" ? (
          <FormField
            control={form.control}
            name="job"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Director, Writer, Producer..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="character"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Character</FormLabel>
                <FormControl>
                  <Input placeholder="Character name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order (optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={field.value?.toString() ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.currentTarget.value === ""
                        ? undefined
                        : Number(e.currentTarget.value)
                    )
                  }
                />
              </FormControl>
              <FormDescription>
                Lower numbers appear first (e.g., top-billed cast).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending || form.getValues("movieId") === 0}
          >
            {isPending ? "Linking..." : "Link to movie"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
