"use client";

import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.union([z.string().max(50), z.literal("")]).optional(),
  city: z.union([z.string().max(100), z.literal("")]).optional(),
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Max 2000 characters"),
});

type FormValues = z.infer<typeof FormSchema>;

type ContactFormProps = {
  variant?: "page" | "dialog";
};

export default function ContactForm({ variant = "page" }: ContactFormProps) {
  const [status, setStatus] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      message: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("Sending...");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setStatus("Thank you! Your message has been sent.");
        form.reset();
      } else {
        setStatus("Could not send the message. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setStatus(
        "An error occurred. Check your internet connection and try again."
      );
    }
  };

  const isSending = form.formState.isSubmitting || status === "Sending...";

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (variant === "dialog") {
      return <div className="w-full max-w-xl">{children}</div>;
    }
    return (
      <div
        id="contact-form"
        className="relative min-h-screen flex items-center justify-center p-4 md:p-8"
      >
        <Image
          src="/images/hero1.png"
          alt="Hero image"
          fill
          priority
          className="absolute -z-10 object-cover"
        />
        <div className="absolute inset-0 bg-background/60 -z-0" />
        <div className="relative z-10 w-full max-w-xl">{children}</div>
      </div>
    );
  };

  return (
    <Wrapper>
      <div className="bg-card/90 text-card-foreground backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-xl w-full border border-border">
        <h2 className="text-3xl font-extrabold text-primary mb-2 text-center">
          Contact us
        </h2>
        <p className="text-muted-foreground mb-8 text-center">
          Fill out the form below and we will get back to you as soon as possible.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="07X-XXX XX XX"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Write your message..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-full text-lg font-bold"
              disabled={isSending}
              variant="default"
            >
              {isSending ? "Sending..." : "Send!"}
            </Button>
          </form>
        </Form>

        {status && (
          <p
            className={`mt-4 text-center font-semibold ${
              status.includes("Thank you") ? "text-primary" : "text-destructive"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </Wrapper>
  );
}
