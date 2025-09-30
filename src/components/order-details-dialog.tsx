"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Calendar, CreditCard, CheckCircle } from "lucide-react";
import { getPosterUrl } from "@/lib/tmdb-image-url";
import Image from "next/image";

interface OrderDetailsDialogProps {
  order: {
    id: number;
    orderDate: Date;
    status: string;
    totalAmount: number;
    customerFirstName: string | null;
    customerLastName: string | null;
    customerEmail: string | null;
    customerAddress: string | null;
    customerPostalCode: string | null;
    customerCity: string | null;
    customerCountry: string | null;
    OrderItem: Array<{
      id: number;
      quantity: number;
      priceAtPurchase: number;
      movie: {
        title: string;
        price: number;
        posterPath: string | null;
      };
    }>;
  };
  children: React.ReactNode;
}

export default function OrderDetailsDialog({ order, children }: OrderDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-primary" />
            Order #{order.id} Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Information Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Order Details */}
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
                  <span>{order.orderDate.toLocaleDateString("sv-SE")}</span>
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
          <Card>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmed</p>
                    <p className="text-sm text-muted-foreground">
                      Your order has been received and confirmed.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full ${
                    order.status === "PENDING" ? "bg-yellow-500" : "bg-primary"
                  } text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {order.status === "PENDING" ? "⏳" : "✓"}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}