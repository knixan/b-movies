"use server";

import { revalidatePath } from "next/cache";
import { clearCartCookie, getCartFromCookie } from "@/cart/cookie";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createOrderAccessToken } from "./order-token";

export interface CheckoutFormValues {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string; // "123 45"
  country: "se";
}

export interface SubmitOrderResult {
  orderId: number;
  token: string;
}

export async function submitOrder(
  form: CheckoutFormValues,
): Promise<SubmitOrderResult | null> {
  const cart = await getCartFromCookie();
  if (!cart.items.length) return null;

  // Hämta filmerna från databasen så att pris och lagersaldo är
  // auktoritativa - klienten (och därmed cart-cookien) litar vi aldrig på.
  const movies = await prisma.movie.findMany({
    where: { id: { in: cart.items.map((i) => i.id) } },
    select: { id: true, price: true, stock: true },
  });
  const movieById = new Map(movies.map((m) => [m.id, m]));

  const orderItems: {
    movieId: number;
    quantity: number;
    priceAtPurchase: number;
  }[] = [];

  for (const item of cart.items) {
    const movie = movieById.get(item.id);
    // Filmen finns inte längre, eller det finns inte tillräckligt i lager
    if (!movie || movie.stock < item.quantity) {
      return null;
    }
    orderItems.push({
      movieId: movie.id,
      quantity: item.quantity,
      priceAtPurchase: movie.price,
    });
  }

  // Summa i SEK, beräknad från databasens priser - inte cookien
  const totalAmount = orderItems.reduce(
    (sum, i) => sum + i.priceAtPurchase * i.quantity,
    0,
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
      // Låt aldrig en oautentiserad gäst-checkout koppla sig till ett
      // riktigt, registrerat konto bara genom att ange dess e-postadress
      // - det skulle låta vem som helst "kapa" någon annans orderhistorik.
      // Vi återanvänder bara rader som själva skapades av en tidigare
      // gäst-checkout (samma "guest_"-prefix).
      if (!existingUser.id.startsWith("guest_")) {
        return null;
      }
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

  // Spara kunduppgifter med ordern (använd formulärdata) och dra av
  // lagersaldo atomärt så att vi aldrig säljer mer än vad som finns i lager.
  let order: { id: number };
  try {
    order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
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
            create: orderItems,
          },
        },
        select: { id: true },
      });

      for (const item of orderItems) {
        const { count } = await tx.movie.updateMany({
          where: { id: item.movieId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        // Någon annan hann köpa av samma lager mellan valideringen ovan
        // och transaktionen - avbryt hela ordern.
        if (count === 0) {
          throw new Error("Insufficient stock");
        }
      }

      return created;
    });
  } catch {
    return null;
  }

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

  return { orderId: order.id, token: createOrderAccessToken(order.id) };
}
