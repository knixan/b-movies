"use client";

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeFromCart } from "@/cart/actions";

type Props = {
  productId: number;
  onUpdated?: () => void;
};

export function CartRemoveButton({ productId, onUpdated }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onRemove = () => {
    startTransition(async () => {
      await removeFromCart(productId);
      onUpdated?.();
      router.refresh();
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-2"
      onClick={onRemove}
      disabled={isPending}
    >
      <XCircle className="h-4 w-4" />
    </Button>
  );
}
