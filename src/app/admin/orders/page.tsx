import { getAllOrders, deleteOrder } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CreateOrderForm from "@/components/forms/create-order-form";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Package, Trash2, Eye, Plus } from "lucide-react";

async function handleDeleteOrder(formData: FormData) {
  "use server";
  await deleteOrder(formData);
}

function getStatusBadge(status: string) {
  const statusVariants = {
    PENDING: "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
    SHIPPED: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
    DELIVERED: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
    CANCELLED: "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20",
    PROCESSING: "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
  };
  
  return (
    <Badge className={statusVariants[status as keyof typeof statusVariants] || "border-border bg-muted text-muted-foreground"}>
      {status}
    </Badge>
  );
}

export default async function AdminOrdersPage() {
  //Authorization
  await requireAdmin();

  const orders = await getAllOrders();

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
            <Package className="h-8 w-8" />
            Order Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all customer orders
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold text-primary">{orders.length}</p>
        </div>
      </div>

      {/* Create New Order Section */}
      <div className="bg-muted/50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-primary">Create New Order</h2>
        </div>
        <CreateOrderForm />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <Eye className="h-6 w-6" />
          All Orders
        </h2>
        
        {orders.length > 0 ? (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="text-lg font-semibold text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                          Order #{order.id}
                        </Link>
                        {getStatusBadge(order.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Customer</p>
                          <p className="font-medium">{order.user?.email || "Unknown"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Order Date</p>
                          <p className="font-medium">
                            {new Date(order.orderDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Amount</p>
                          <p className="font-medium">${order.totalAmount}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                      
                      <form action={handleDeleteOrder}>
                        <input type="hidden" name="id" value={order.id} />
                        <Button
                          type="submit"
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/50">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No orders found</p>
            <p className="text-sm text-muted-foreground">Create your first order to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
