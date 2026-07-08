import { createHmac, timingSafeEqual } from "crypto";

function getSecret() {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is not set");
  }
  return secret;
}

// Unguessable per-order token so a guest can view their own order
// confirmation without an account, without letting anyone else enumerate
// /checkout/success/<id> to read other customers' orders.
export function createOrderAccessToken(orderId: number): string {
  return createHmac("sha256", getSecret())
    .update(String(orderId))
    .digest("hex");
}

export function isValidOrderAccessToken(
  orderId: number,
  token: string | undefined,
): boolean {
  if (!token) return false;

  const expected = Buffer.from(createOrderAccessToken(orderId));
  const given = Buffer.from(token);
  if (expected.length !== given.length) return false;

  return timingSafeEqual(expected, given);
}
