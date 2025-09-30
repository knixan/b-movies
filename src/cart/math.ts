export type PriceQuantity = { price: number; quantity: number };

export function cartTotal<T extends PriceQuantity>(items: T[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
