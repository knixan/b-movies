"use server";

import { revalidatePath } from "next/cache";
import { clearCartCookie, getCartFromCookie } from "@/cart/cookie";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export interface CheckoutFormValues {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string; // "123 45"
  country: "se";
}

export async function submitOrder(
  form: CheckoutFormValues
): Promise<number | null> {
  const cart = await getCartFromCookie();
  if (!cart.items.length) return null;

  // Summa i SEK
  const totalAmount = cart.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // Hämta inloggad användare via Better Auth-session från servern
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  let userId = session?.user?.id;

  // Om användaren inte är inloggad, hitta eller skapa en gästanvändare
  if (!userId) {
    // Först, försök hitta en befintlig användare med samma email
    const existingUser = await prisma.user.findUnique({
      where: { email: form.email },
      select: { id: true },
    });

    if (existingUser) {
      // Använd befintlig användare
      userId = existingUser.id;
    } else {
      // Skapa ny gästanvändare
      const guestUser = await prisma.user.create({
        data: {
          id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      userId = guestUser.id;
    }
  }

  // Spara kunduppgifter med ordern (använd formulärdata)
  const order = await prisma.order.create({
    data: {
      status: "PENDING",
      orderDate: new Date(),
      totalAmount: totalAmount,
      userId,
      // Spara kunduppgifter från formuläret
      customerEmail: form.email,
      customerFirstName: form.firstName,
      customerLastName: form.lastName,
      customerAddress: form.address,
      customerCity: form.city,
      customerPostalCode: form.postalCode,
      customerCountry: form.country,
      OrderItem: {
        create: cart.items.map((i) => ({
          movieId: i.id,
          quantity: i.quantity,
          priceAtPurchase: i.price,
        })),
      },
    },
    select: { id: true },
  });

  // Explicit cookie clearing med verifiering
  console.log("🛒 Clearing cart cookie after order creation...");
  await clearCartCookie();

  // Vänta lite för att säkerställa att cookien hinner sparas
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Verifiera att cookien är tömd
  const clearedCart = await getCartFromCookie();
  console.log("✅ Cart after clearing:", clearedCart);

  revalidatePath("/", "layout");
  revalidatePath("/checkout");

  return order.id;
}
