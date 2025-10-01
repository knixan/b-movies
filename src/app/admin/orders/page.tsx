import { requireAdmin } from "@/lib/auth";
import AdminOrdersClient from "./client";
import { getAllOrders, deleteOrder, updateOrderStatus } from "@/actions/orders";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await getAllOrders();

  async function onDelete(formData: FormData) {
    "use server";
    await deleteOrder(formData);
  }

  async function onStatusUpdate(formData: FormData) {
    "use server";
    await updateOrderStatus(formData);
  }

  return (
    <AdminOrdersClient
      initialOrders={orders}
      onDelete={onDelete}
      onStatusUpdate={onStatusUpdate}
    />
  );
}
