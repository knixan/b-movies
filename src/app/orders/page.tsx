import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/actions/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Calendar, Eye } from "lucide-react";
import OrderDetailsDialog from "@/components/order-details-dialog";
import Link from "next/link";
import Image from "next/image";

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          View your order history and track your purchases
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-4">
              You haven&apos;t made any orders yet. Start shopping to see your orders here!
            </p>
            <Link
              href="/movies"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Movies
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order #{order.id}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {order.orderDate.toLocaleDateString("sv-SE")}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        {order.status === "PENDING" ? "Processing" : order.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{order.totalAmount} SEK</p>
                    <p className="text-sm text-muted-foreground">
                      {order.OrderItem.length} {order.OrderItem.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {order.OrderItem.slice(0, 3).map((item, index) => (
                      <div
                        key={item.id}
                        className="w-12 h-16 bg-gray-200 rounded  relative"
                        style={{ zIndex: 3 - index }}
                      >
                        {item.movie.posterPath ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w92${item.movie.posterPath}`}
                            alt={item.movie.title}
                            className="w-full h-full object-cover rounded "
                            fill
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {order.OrderItem.length > 3 && (
                      <div className="w-12 h-16 bg-gray-100 border-2 border-white rounded flex items-center justify-center text-xs font-medium text-gray-600">
                        +{order.OrderItem.length - 3}
                      </div>
                    )}
                  </div>
                  <OrderDetailsDialog order={order}>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </OrderDetailsDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}