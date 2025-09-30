"use server";

import { revalidatePath } from "next/cache";
import {
  getCartFromCookie,
  setCartCookie,
  clearCartCookie,
  type CartItem,
} from "./cookie";

export async function getCart() {
  return getCartFromCookie();
}

export async function addToCart(
  item: Omit<CartItem, "quantity"> & { quantity?: number }
) {
  const cart = await getCartFromCookie();
  const qty = Math.max(1, item.quantity ?? 1);
  const existing = cart.items.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.items.push({ ...item, quantity: qty });
  }
  await setCartCookie(cart);
  revalidatePath("/", "layout");
  revalidatePath("/checkout");
  return cart;
}

export async function updateCartQuantity(productId: number, delta: number) {
  const cart = await getCartFromCookie();
  const item = cart.items.find((i) => i.id === productId);
  if (!item) return cart;
  item.quantity = Math.max(1, item.quantity + delta);
  await setCartCookie(cart);
  revalidatePath("/", "layout");
  revalidatePath("/checkout");
  return cart;
}

export async function removeFromCart(productId: number) {
  const cart = await getCartFromCookie();
  cart.items = cart.items.filter((i) => i.id !== productId);
  if (cart.items.length === 0) {
    await clearCartCookie();
  } else {
    await setCartCookie(cart);
  }
  revalidatePath("/", "layout");
  revalidatePath("/checkout");
  return cart;
}

export async function clearCart() {
  await clearCartCookie();
  revalidatePath("/", "layout");
  revalidatePath("/checkout");
}
