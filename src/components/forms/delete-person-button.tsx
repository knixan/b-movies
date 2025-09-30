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
import { deletePerson } from "@/actions/person";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// This does not use react-hook-form because it's a simple confirmation dialog
export function DeletePersonButton({ personId }: { personId: number }) {
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="max-w-1/4">
          Delete Person
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            person.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          action={async (formData) => {
            try {
              const id = Number(formData.get("id"));
              await deletePerson(id);
              toast.success("Person deleted");
              router.push("/person");
            } catch (e) {
              console.error(e);
              toast.error("Failed to delete person");
            }
          }}
        >
          <input type="hidden" name="id" value={personId} />
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
