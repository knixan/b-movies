"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { addToCart } from "@/cart/actions";
import { toast } from "sonner";

export function AddToCartForm({
  movieId,
  title,
  price,
  imageUrl,
  stock,
}: {
  movieId: number;
  title: string;
  price: number;
  imageUrl: string;
  stock?: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity((prev) => prev + 1);

  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        await addToCart({
          id: movieId,
          name: title,
          price,
          quantity,
          imageUrl,
        });
        toast.success(`${title} added to cart`);
      } catch (error) {
        toast.error("Failed to add to cart");
        console.error(error);
      }
      router.refresh();
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center border border-border rounded-md bg-background/20 backdrop-blur-sm">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="border-0 bg-transparent text-foreground hover:bg-muted/10"
        >
          -
        </Button>
        <span className="px-4 text-foreground">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrease}
          className="border-0 bg-transparent text-foreground hover:bg-muted/10"
        >
          +
        </Button>
      </div>
      <Button
        className="flex-[0.5] bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg"
        disabled={stock === 0 || isPending}
        onClick={handleAddToCart}
      >
        Add to cart
      </Button>
    </div>
  );
}
