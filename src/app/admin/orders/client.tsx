"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Package,
  Trash2,
  Eye,
  Filter,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface Order {
  id: number;
  status: string;
  totalAmount: number;
  orderDate: string | Date;
  user: {
    email: string;
  } | null;
}

type Props = {
  initialOrders: Order[];
  onDelete: (formData: FormData) => Promise<void>;
  onStatusUpdate: (formData: FormData) => Promise<void>;
};

function getStatusBadge(status: string) {
  const statusVariants = {
    PENDING: {
      variant:
        "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
      icon: <Clock className="h-3 w-3" />,
    },
    PROCESSING: {
      variant:
        "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100",
      icon: <Package className="h-3 w-3" />,
    },
    SHIPPED: {
      variant: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
      icon: <Truck className="h-3 w-3" />,
    },
    DELIVERED: {
      variant: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
      icon: <CheckCircle className="h-3 w-3" />,
    },
    CANCELLED: {
      variant:
        "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20",
      icon: <XCircle className="h-3 w-3" />,
    },
  };

  const statusConfig =
    statusVariants[status as keyof typeof statusVariants] ||
    statusVariants.PENDING;

  return (
    <Badge className={statusConfig.variant + " flex items-center gap-1"}>
      {statusConfig.icon}
      {status}
    </Badge>
  );
}

export default function AdminOrdersClient({
  initialOrders,
  onDelete,
  onStatusUpdate,
}: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders ?? []);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading] = useState(false);

  useEffect(() => {
    if (statusFilter === "ALL") {
      setFilteredOrders(orders);
    } else if (statusFilter === "NOT_HANDLED") {
      setFilteredOrders(orders.filter((order) => order.status === "PENDING"));
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status === statusFilter)
      );
    }
  }, [orders, statusFilter]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const fd = new FormData();
    fd.append("id", String(orderId));
    fd.append("status", newStatus);
    await onStatusUpdate(fd);
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleDelete = async (orderId: number) => {
    if (confirm("Är du säker på att du vill ta bort denna order?")) {
      const fd = new FormData();
      fd.append("id", String(orderId));
      await onDelete(fd);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    }
  };

  const getFilterCounts = () => {
    return {
      all: orders.length,
      notHandled: orders.filter((o) => o.status === "PENDING").length,
      processing: orders.filter((o) => o.status === "PROCESSING").length,
      shipped: orders.filter((o) => o.status === "SHIPPED").length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
    };
  };

  const counts = getFilterCounts();

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading orders...</div>
        </div>
      </div>
    );
  }

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

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={statusFilter === "ALL" ? "default" : "outline"}
              onClick={() => setStatusFilter("ALL")}
              className="flex items-center gap-2"
            >
              All ({counts.all})
            </Button>
            <Button
              variant={statusFilter === "NOT_HANDLED" ? "default" : "outline"}
              onClick={() => setStatusFilter("NOT_HANDLED")}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Not handled ({counts.notHandled})
            </Button>
            <Button
              variant={statusFilter === "PROCESSING" ? "default" : "outline"}
              onClick={() => setStatusFilter("PROCESSING")}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Handled ({counts.processing})
            </Button>
            <Button
              variant={statusFilter === "SHIPPED" ? "default" : "outline"}
              onClick={() => setStatusFilter("SHIPPED")}
              className="flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              Shipped ({counts.shipped})
            </Button>
            <Button
              variant={statusFilter === "DELIVERED" ? "default" : "outline"}
              onClick={() => setStatusFilter("DELIVERED")}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Delivered ({counts.delivered})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <Eye className="h-6 w-6" />
          {statusFilter === "ALL"
            ? "All Orders"
            : statusFilter === "NOT_HANDLED"
            ? "Not handled Orders"
            : `${statusFilter} Orders`}{" "}
          ({filteredOrders.length})
        </h2>

        {filteredOrders.length > 0 ? (
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
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
                          <p className="font-medium">
                            {order.user?.email || "Unknown"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Order Date</p>
                          <p className="font-medium">
                            {new Date(order.orderDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Amount</p>
                          <p className="font-medium">${order.totalAmount}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4 min-w-[200px]">
                      {/* Quick Status Update */}
                      <div className="flex items-center gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusChange(order.id, value)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PROCESSING">
                              Processing
                            </SelectItem>
                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Details
                          </Button>
                        </Link>

                        <Button
                          onClick={() => handleDelete(order.id)}
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>

                      {/* Quick Action Buttons */}
                      {order.status === "PENDING" && (
                        <div className="flex gap-1">
                          <Button
                            onClick={() =>
                              handleStatusChange(order.id, "PROCESSING")
                            }
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                          >
                            Mark as Handled
                          </Button>
                        </div>
                      )}
                      {order.status === "PROCESSING" && (
                        <div className="flex gap-1">
                          <Button
                            onClick={() =>
                              handleStatusChange(order.id, "SHIPPED")
                            }
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                          >
                            Mark as Shipped
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                {statusFilter === "ALL"
                  ? "No orders found"
                  : `No ${statusFilter.toLowerCase()} orders`}
              </p>
              <p className="text-sm text-muted-foreground">
                {statusFilter === "ALL"
                  ? "Create your first order to get started"
                  : "Try a different filter"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
