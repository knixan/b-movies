"use client";

import { deleteGenre } from "@/actions/genres";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function DeleteGenreButton({ id, name }: { id: number; name: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Genre?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The genre &quot;{name}&quot; will be
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          action={async () => {
            try {
              await deleteGenre(id);
              toast.success("Genre deleted");
            } catch (e) {
              console.error(e);
              toast.error("Failed to delete genre");
            }
          }}
        >
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteGenreButton;
