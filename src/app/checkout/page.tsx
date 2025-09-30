import { getCartFromCookie } from "@/cart/cookie";
import { cartTotal } from "@/cart/math";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitOrder, type CheckoutFormValues } from "@/checkout/actions";
import { redirect } from "next/navigation";
// Checkout page, server component
export const runtime = "nodejs";

export default async function CheckoutPage() {
  const cart = await getCartFromCookie();
  const cartItems = cart.items;
  const total = cartTotal(cartItems);
  // Server action to handle form submission
  async function placeOrder(formData: FormData) {
    "use server";
    const values: CheckoutFormValues = {
      email: String(formData.get("email") || ""),
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      address: String(formData.get("address") || ""),
      city: String(formData.get("city") || ""),
      postalCode: String(formData.get("postalCode") || ""),
      country: "se",
    };
    const orderId = await submitOrder(values); // Returns order ID or null
    if (orderId) {
      redirect(`/checkout/success/${orderId}`); // Redirect to success page with order ID
    }
    redirect("/checkout"); // If order failed, stay on checkout page
  }
  //
  // Checkout page Frontend
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 rounded-lg shadow-lg bg-background dark:bg-zinc-900 transition-colors duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-center text-lg text-muted-foreground">
          Your cart is empty.
        </p>
      ) : (
        <form action={placeOrder} className="space-y-8">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-3 border-b border-muted last:border-b-0"
              >
                <span className="text-lg">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-semibold">
                  {item.price * item.quantity} kr
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold text-xl py-4 border-t border-muted">
            <span>Total:</span>
            <span>{total} SEK</span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-lg">
                  First name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="Firstname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-lg">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Lastname"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-lg">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                type="text"
                required
                placeholder="Streetname"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-lg">
                  Zip code
                </Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  required
                  placeholder="Zip code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-lg">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  required
                  placeholder="City"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">
                E-mail
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="email"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md font-semibold shadow-sm transition-colors duration-200 ease-in-out bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Pay FAKE!
          </button>
        </form>
      )}
    </div>
  );
}
