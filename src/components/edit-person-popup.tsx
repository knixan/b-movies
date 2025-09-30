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
import type { Person } from "@/generated/prisma";
import UpdatePersonForm from "@/components/forms/update-person-form";
import { LinkPersonToMovieForm } from "@/components/forms/link-person-to-movie-form";
import { Separator } from "@/components/ui/separator";
import { DeletePersonButton } from "./forms/delete-person-button";

export function EditPersonPopup({ person }: { person: Person }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Edit Person</Button>
      </DialogTrigger>

      <DialogContent className="w-3/4 sm:max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit person</DialogTitle>
          <DialogDescription>
            Update details or link this person to a movie.
          </DialogDescription>
        </DialogHeader>

        {/* 1 column on mobile; on lg use 3 tracks: left | thin separator | right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8">
          <div className="min-w-0 flex flex-col gap-4">
            <UpdatePersonForm person={person} />
            <Separator />
            <DeletePersonButton personId={person.id} />
          </div>

          <Separator orientation="vertical" className="hidden lg:block" />

          <div className="min-w-0">
            <LinkPersonToMovieForm personId={person.id} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
