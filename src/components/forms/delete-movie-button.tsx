"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteMovie } from "@/actions/movies";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// This does not use react-hook-form because it's a simple confirmation dialog
export function DeleteMovieButton({ movieId }: { movieId: number }) {
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="max-w-1/4">
          Delete Movie
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            movie.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          action={async (formData) => {
            try {
              const id = Number(formData.get("id"));
              await deleteMovie(id);
              toast.success("Movie deleted");
              router.push("/movies");
            } catch (e) {
              console.error(e);
              toast.error("Failed to delete movie");
            }
          }}
        >
          <input type="hidden" name="id" value={movieId} />
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
