import { getOrderById, updateOrderStatus } from "@/actions/orders";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { requireAdmin } from "@/lib/auth";
import { 
  Package, 
  User, 
  Calendar, 
  DollarSign, 
  Film, 
  ArrowLeft,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface OrderDetailsPageProps {
  params: {
    orderId: string;
  };
}

async function handleStatusUpdate(formData: FormData) {
  "use server";
  await updateOrderStatus(formData);
}

function getStatusIcon(status: string) {
  const icons = {
    PENDING: <Clock className="h-4 w-4" />,
    PROCESSING: <Package className="h-4 w-4" />,
    SHIPPED: <Truck className="h-4 w-4" />,
    DELIVERED: <CheckCircle className="h-4 w-4" />,
    CANCELLED: <XCircle className="h-4 w-4" />
  };
  
  return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />;
}

function getStatusBadge(status: string) {
  const statusVariants = {
    PENDING: "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
    PROCESSING: "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100",
    SHIPPED: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
    DELIVERED: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
    CANCELLED: "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20"
  };
  
  return (
    <Badge className={`${statusVariants[status as keyof typeof statusVariants] || "border-border bg-muted text-muted-foreground"} flex items-center gap-1`}>
      {getStatusIcon(status)}
      {status}
    </Badge>
  );
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  await requireAdmin();
  
  const order = await getOrderById(params.orderId);

  if (!order) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-4xl text-primary font-bold">Order Details</h1>
        </div>
        
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-medium text-destructive mb-2">Order Not Found</p>
              <p className="text-muted-foreground">
                Could not find order with ID: {params.orderId}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/orders" className="w-full">
              <Button className="w-full flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const totalItems = order.OrderItem.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl text-primary font-bold">Order #{order.id}</h1>
            <p className="text-muted-foreground">Order management and details</p>
          </div>
        </div>
        
        <Link href="/admin/orders">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{order.user?.email || "Unknown"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/50 rounded-lg">
                    <Calendar className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent rounded-lg">
                    <DollarSign className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-medium text-lg">${order.totalAmount}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Film className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                    <p className="font-medium">{totalItems}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="h-5 w-5" />
                Ordered Movies ({order.OrderItem.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.OrderItem.length > 0 ? (
                <div className="space-y-4">
                  {order.OrderItem.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.movie.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Quantity: {item.quantity}</span>
                          <span>Price: ${item.priceAtPurchase}</span>
                          <span className="font-medium text-foreground">
                            Subtotal: ${item.priceAtPurchase * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                  <div className="text-center py-8">
                    <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No movies found for this order</p>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Status & Actions */}
        <div className="space-y-6">
          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                {getStatusBadge(order.status)}
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                Current status of order #{order.id}
              </div>
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={handleStatusUpdate} className="space-y-4">
                <input type="hidden" name="id" value={order.id} />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Status</label>
                  <Select name="status" defaultValue={order.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="PROCESSING">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Processing
                        </div>
                      </SelectItem>
                      <SelectItem value="SHIPPED">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Shipped
                        </div>
                      </SelectItem>
                      <SelectItem value="DELIVERED">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Delivered
                        </div>
                      </SelectItem>
                      <SelectItem value="CANCELLED">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Cancelled
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full">
                  Update Status
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Customer Information */}
          {(order.customerEmail || order.customerFirstName) && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.customerFirstName && (
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {order.customerFirstName} {order.customerLastName}
                    </p>
                  </div>
                )}
                {order.customerEmail && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{order.customerEmail}</p>
                  </div>
                )}
                {order.customerAddress && (
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {order.customerAddress}<br />
                      {order.customerCity} {order.customerPostalCode}<br />
                      {order.customerCountry}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
