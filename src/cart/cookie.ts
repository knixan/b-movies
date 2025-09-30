import { cookies } from "next/headers";
import { CART_COOKIE_NAME, COOKIE_OPTIONS } from "./constants";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  tmdb?: boolean;
}

export interface Cart {
  items: CartItem[];
}

function safeParse<T>(json: string | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export async function getCartFromCookie(): Promise<Cart> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE_NAME)?.value;
  const cart = safeParse<Cart>(raw, { items: [] });
  cart.items = cart.items
    .map((i) => ({ ...i, quantity: Math.max(1, Math.round(i.quantity || 1)) }))
    .filter((i) => Number.isFinite(i.price) && Number.isFinite(i.id));
  return cart;
}

export async function setCartCookie(cart: Cart) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), COOKIE_OPTIONS);
}

export async function clearCartCookie() {
  const cookieStore = await cookies();
  // Använd delete istället för att sätta tom sträng
  cookieStore.delete(CART_COOKIE_NAME);

  // Backup: sätt även tom sträng med omedelbar expiration
  cookieStore.set(CART_COOKIE_NAME, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0), // Explicit expiration datum
  });
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
