import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cartTotal } from "@/cart/math";
import { CartQuantityButtons } from "@/components/cart-quantity-buttons";
import { CartRemoveButton } from "@/components/cart-remove-button";
import { getCart } from "@/cart/actions";

export default async function ShoppingCartSheet() {
  // Fetch cart data from cookies
  const cart = await getCart();
  const totalAmount = cartTotal(cart.items);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-foreground hover:text-primary transition transform hover:scale-110"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="sr-only">Shopping Cart</span>
          {cart.items.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-sky-700 rounded-full">
              {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          {cart.items.length > 0 ? (
            cart.items.map((item) => (
              <div
                key={item.id + (item.tmdb ? "-tmdb" : "")}
                className="flex m-6 items-center justify-between"
              >
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={48}
                    height={64}
                    className="w-12 h-16 object-cover mr-2 rounded"
                    unoptimized
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.price} kr
                  </p>
                  {item.tmdb && (
                    <span className="text-xs text-blue-500">TMDB-film</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <CartQuantityButtons
                    productId={item.id}
                    quantity={item.quantity}
                  />
                  <CartRemoveButton productId={item.id} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              Your cart is empty.
            </div>
          )}
        </div>
        <Separator />
        {cart.items.length > 0 && (
          <div className="mt-4 m-6 flex justify-between font-bold">
            <span>Total:</span>
            <span>{totalAmount} kr</span>
          </div>
        )}
        <SheetFooter className="mt-4 flex flex-col gap-2">
          <Link href="/checkout" className="w-full">
            <Button className="w-full text-white">Go to Checkout</Button>
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
