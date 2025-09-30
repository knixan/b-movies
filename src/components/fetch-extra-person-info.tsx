"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { addExtraPersonInfo } from "@/actions/api-actions";

export default function FetchExtraPersonInfo({
  personId,
  needExtra,
}: {
  personId: number;
  needExtra: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!needExtra) return;

    let mounted = true;

    (async () => {
      try {
        await addExtraPersonInfo(personId);
        // After server action updates DB (and calls revalidatePath),
        // refresh the client to fetch updated server-rendered data.
        if (mounted) router.refresh();
      } catch (err) {
        console.error("Failed to fetch extra person info:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [personId, needExtra, router]);

  return null;
}
