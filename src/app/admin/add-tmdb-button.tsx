"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AddTmdbButton({
  onAdd,
}: {
  onAdd: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      onClick={async () => {
        setIsLoading(true);
        await onAdd().finally(() => setIsLoading(false));
      }}
    >
      {isLoading ? "Adding..." : "Add TMDB to database"}
    </Button>
  );
}
