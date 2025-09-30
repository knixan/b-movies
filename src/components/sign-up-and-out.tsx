"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { LogOut, UserPlus } from "lucide-react";
import SignUpForm from "./forms/sign-up-form";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignUpAndOut({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Successfully signed out");
          router.refresh();
        },
      },
    });
  };

  if (!isLoggedIn) {
    // if logged out → sign up dialog
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition transform hover:scale-110"
          >
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">Sign Up</DialogTitle>
          </DialogHeader>
          <SignUpForm />
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Button
        onClick={handleSignOut}
        variant="outline"
        className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition transform hover:scale-110"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    );
  }
}
