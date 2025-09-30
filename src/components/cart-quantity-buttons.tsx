"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateCartQuantity } from "@/cart/actions";

type Props = {
  productId: number;
  quantity: number;
  onUpdated?: () => void;
};

export function CartQuantityButtons({ productId, quantity, onUpdated }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (delta: number) => {
    startTransition(async () => {
      await updateCartQuantity(productId, delta);
      onUpdated?.();
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleChange(-1)}
        disabled={isPending || quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-6 text-center">{quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleChange(1)}
        disabled={isPending}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
