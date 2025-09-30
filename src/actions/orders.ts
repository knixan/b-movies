"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { updateOrderStatusSchema } from "@/lib/zod-schemas";
import { requireAdmin } from "@/lib/auth";

// --- Hämta alla ordrar ---
export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });
    return orders;
  } catch (error) {
    return [];
  }
}

// --- Hämta användarens ordrar ---
export async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
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
    return orders;
  } catch (error) {
    return [];
  }
}

// --- Hämta en order med ID ---
export async function getOrderById(orderId: string) {
  const id = Number(orderId);
  if (isNaN(id)) return null;

  try {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        OrderItem: {
          include: {
            movie: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
}

// --- Skapa en ny order (används av kassan, ej admin) ---
export async function createOrder(formData: FormData) {

   //Authorization
    await requireAdmin();

  const data = Object.fromEntries(formData);
  const userId = data.userId as string;

  if (!userId) {
    return { success: false, errors: { _global: ["Ogiltigt användar-ID."] } };
  }

  try {
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        totalAmount: 0, // Initial amount, can be updated when items are added
        status: "PENDING", // Initial status
        orderDate: new Date(), // Current date/time
        // Lägg till OrderItem om du vill skapa filmer i ordern direkt
        // OrderItem: { create: ... }
      },
    });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: { _global: ["Kunde inte skapa ordern."] },
    };
  }
}

// --- Ta bort en order ---
export async function deleteOrder(formData: FormData) {

   //Authorization
    await requireAdmin();

  const data = Object.fromEntries(formData);
  const orderId = Number(data.id);

  if (!orderId) {
    return { success: false, errors: { _global: ["Ogiltigt order-ID."] } };
  }

  try {
    await prisma.order.delete({
      where: { id: orderId },
    });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: { _global: ["Kunde inte ta bort ordern."] },
    };
  }
}

// --- Uppdatera en orders status ---
export async function updateOrderStatus(formData: FormData) {

   //Authorization
    await requireAdmin();
    
  const data = Object.fromEntries(formData);
  const validated = updateOrderStatusSchema.safeParse({
    ...data,
    id: Number(data.id),
  });

  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.order.update({
      where: { id: validated.data.id },
      data: { status: validated.data.status },
    });
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${validated.data.id}`);
    return { success: true, message: `Order status updated to ${validated.data.status}` };
  } catch (error) {
    return {
      success: false,
      errors: { _global: ["Could not update order status."] },
    };
  }
}

// --- Lägg till item till order ---
export async function addOrderItem(formData: FormData) {
  await requireAdmin();
  
  const data = Object.fromEntries(formData);
  const orderId = Number(data.orderId);
  const movieId = Number(data.movieId);
  const quantity = Number(data.quantity) || 1;

  if (!orderId || !movieId) {
    return { success: false, errors: { _global: ["Invalid order ID or movie ID."] } };
  }

  try {
    // Get movie price
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      select: { price: true, title: true }
    });

    if (!movie) {
      return { success: false, errors: { _global: ["Movie not found."] } };
    }

    // Add order item
    await prisma.orderItem.create({
      data: {
        orderId,
        movieId,
        quantity,
        priceAtPurchase: movie.price,
      },
    });

    // Update order total
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId },
    });
    
    const newTotal = orderItems.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);
    
    await prisma.order.update({
      where: { id: orderId },
      data: { totalAmount: newTotal },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, message: `Added ${movie.title} to order` };
  } catch (error) {
    return {
      success: false,
      errors: { _global: ["Could not add item to order."] },
    };
  }
}

// --- Ta bort item från order ---
export async function removeOrderItem(formData: FormData) {
  await requireAdmin();
  
  const data = Object.fromEntries(formData);
  const orderItemId = Number(data.orderItemId);

  if (!orderItemId) {
    return { success: false, errors: { _global: ["Invalid order item ID."] } };
  }

  try {
    // Get order item to get order ID before deleting
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      select: { orderId: true }
    });

    if (!orderItem) {
      return { success: false, errors: { _global: ["Order item not found."] } };
    }

    // Delete order item
    await prisma.orderItem.delete({
      where: { id: orderItemId },
    });

    // Update order total
    const remainingItems = await prisma.orderItem.findMany({
      where: { orderId: orderItem.orderId },
    });
    
    const newTotal = remainingItems.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);
    
    await prisma.order.update({
      where: { id: orderItem.orderId },
      data: { totalAmount: newTotal },
    });

    revalidatePath(`/admin/orders/${orderItem.orderId}`);
    return { success: true, message: "Item removed from order" };
  } catch (error) {
    return {
      success: false,
      errors: { _global: ["Could not remove item from order."] },
    };
  }
}
