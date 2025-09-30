"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { Movie } from "@/generated/prisma";
import UpdateMovieForm from "@/components/forms/update-movie-form";
import { EditMovieGenres } from "./forms/edit-movie-genres";
import { Separator } from "@/components/ui/separator";
import { DeleteMovieButton } from "@/components/forms/delete-movie-button";

export function EditMoviePopup({
  movie,
  allGenres,
  initialSelectedIds,
}: {
  movie: Movie;
  allGenres: { id: number; name: string }[];
  initialSelectedIds: number[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Edit Movie</Button>
      </DialogTrigger>
      <DialogContent className="w-3/4 sm:max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit movie</DialogTitle>
          <DialogDescription>
            Update details and save changes.
          </DialogDescription>
        </DialogHeader>
        {/* 1 column on mobile; on lg use 3 tracks: left | thin separator | right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8">
          <div className="min-w-0 flex flex-col gap-4">
            <UpdateMovieForm movie={movie} />
            <Separator />
            <DeleteMovieButton movieId={movie.id} />
          </div>

          <Separator orientation="vertical" className="hidden lg:block" />

          <div className="min-w-0">
            <EditMovieGenres
              movieId={movie.id}
              allGenres={allGenres}
              initialSelectedIds={initialSelectedIds}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="w-30">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
