import { NextResponse } from "next/server";
import { getCartFromCookie } from "@/cart/cookie";

export async function GET() {
  const cart = await getCartFromCookie();
  return NextResponse.json(cart);
}
