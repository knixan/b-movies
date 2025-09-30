"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createOrder } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { User, Loader2 } from "lucide-react";

const CreateOrderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

type CreateOrderValues = z.infer<typeof CreateOrderSchema>;

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Could not create order. Please try again.";
}

export default function CreateOrderForm() {
  const form = useForm<CreateOrderValues>({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: {
      userId: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: CreateOrderValues) => {
    const formData = new FormData();
    formData.append("userId", values.userId);

    await toast.promise(createOrder(formData), {
      loading: "Creating order...",
      success: () => {
        form.reset();
        return "Order created successfully!";
      },
      error: (err) => getErrorMessage(err),
    });
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
        <CardDescription>Create a new order in the database.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. clx2k7..."
                        className="pl-10"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the user ID for the new order.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating order...
                </>
              ) : (
                "Create New Order"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
