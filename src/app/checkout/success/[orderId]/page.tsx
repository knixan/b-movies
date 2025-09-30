import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Calendar, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";
import { getPosterUrl } from "@/lib/tmdb-image-url";
import Link from "next/link";
import Image from "next/image";

interface SuccessPageProps {
  params: Promise<{ orderId: string }>;
}

async function getOrderDetails(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        OrderItem: {
          include: {
            movie: {
              select: {
                title: true,
                price: true,
                posterPath: true,
              },
            },
          },
        },
      },
    });
    return order;
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({
  params,
}: SuccessPageProps) {
  const { orderId } = await params;
  const order = await getOrderDetails(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Thank you message */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Thanks for your order!
        </h1>
        <p className="text-lg text-muted-foreground">
          Your order has been received and is being processed.
        </p>
      </div>

      {/* Order details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Order Number:</span>
              <span>#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Order Date:</span>
              <span>{order.orderDate.toLocaleDateString("en-US")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                {order.status === "PENDING" ? "Processing" : order.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
              <span>Total:</span>
              <span>{order.totalAmount} SEK</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              Shipping Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <p className="font-medium">
                {order.customerFirstName} {order.customerLastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.customerEmail}
              </p>
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm">{order.customerAddress}</p>
              <p className="text-sm">
                {order.customerPostalCode} {order.customerCity}
              </p>
              <p className="text-sm">{order.customerCountry?.toUpperCase()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ordered items */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Movies Ordered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.OrderItem.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 pb-4 border-b last:border-b-0"
              >
                <div className="w-16 h-24 bg-gray-200 rounded flex-shrink-0 relative">
                  {item.movie.posterPath ? (
                    <Image
                      src={
                        getPosterUrl(item.movie.posterPath, "w185") ||
                        "/placeholder1.png"
                      }
                      alt={item.movie.title}
                      fill
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.movie.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {item.priceAtPurchase * item.quantity} SEK
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.priceAtPurchase} SEK/piece
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next steps */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            What happens next?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">Order Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  You will receive an email confirmation shortly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">Processing</p>
                <p className="text-sm text-muted-foreground">
                  Your order is being processed and prepared for delivery.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-sm text-muted-foreground">
                  You will receive your movies within 72 hours.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back to store */}
      <div className="text-center mt-8">
        <Link
          href="/movies"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
