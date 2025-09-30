import { z } from "zod";

// --- Movies Shemas ---
export const createMovieSchema = z.object({
  tmdbId: z.coerce.number<number>().positive().optional(),
  title: z.string().min(1, { message: "Titel är obligatoriskt." }),
  overview: z.string().optional(),
  tagline: z.string().optional(),
  releaseDate: z.date().optional(),
  budget: z.coerce.number<number>().positive().optional(),
  revenue: z.coerce.number<number>().positive().optional(),
  runtime: z.coerce.number<number>().positive().optional(),
  price: z.coerce.number<number>().positive().optional(),
  stock: z.coerce.number<number>().int().min(0).optional(),
  posterPath: z.string().optional(),
  backdropPath: z.string().optional(),
});

export type CreateMovieInput = z.infer<typeof createMovieSchema>;

export const updateMovieSchema = z.object({
  tmdbId: z.coerce.number<number>().positive().optional(),
  id: z.number().int().positive(),
  title: z.string().min(1, { message: "Title is required." }).optional(),
  overview: z.string().optional(),
  tagline: z.string().optional(),
  releaseDate: z.date().optional(),
  budget: z.coerce.number<number>().positive().optional(),
  revenue: z.coerce.number<number>().positive().optional(),
  runtime: z.coerce.number<number>().positive().optional(),
  price: z.coerce.number<number>().positive().optional(),
  stock: z.coerce.number<number>().int().min(0).optional(),
  posterPath: z.string().optional(),
  backdropPath: z.string().optional(),
});

export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;

export const deleteMovieSchema = z.object({
  id: z.number().int().positive(),
});

// --- Person Schemas ---
export const createPersonSchema = z.object({
  tmdbId: z.coerce.number<number>().positive().optional(),
  name: z.string().min(1),
  birthday: z.date().optional(),
  deathday: z.date().optional(),
  biography: z.string().optional(),
  profilePath: z.string().optional(),
});

export type CreatePersonInput = z.infer<typeof createPersonSchema>;

export const updatePersonSchema = z.object({
  id: z.coerce.number<number>().positive().optional(),
  tmdbId: z.coerce.number<number>().positive().optional(),
  name: z.string().optional(),
  birthday: z.date().optional(),
  deathday: z.date().optional(),
  biography: z.string().optional(),
  profilePath: z.string().optional(),
});

export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;

export const deletePersonSchema = z.object({
  id: z.number().int().positive(),
});

export type DeletePersonInput = z.infer<typeof deletePersonSchema>;

// --- Genre Schemas ---
export const createGenreSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type CreateGenreInput = z.infer<typeof createGenreSchema>;

export const updateGenreSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;

export const deleteGenreSchema = z.object({
  id: z.number().int().positive(),
});

export type DeleteGenreInput = z.infer<typeof deleteGenreSchema>;

// --- MovieCrew link schemas ---
export const roleEnum = z.enum(["CREW", "CAST"]);

export const linkPersonToMovieSchema = z
  .object({
    personId: z.coerce.number<number>().int().positive(),
    movieId: z.coerce.number<number>().int().positive(),
    role: roleEnum,
    job: z.string().trim().optional(),
    character: z.string().trim().optional(),
    order: z.coerce.number<number>().int().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "CREW") {
      // For crew, job is required; character must be empty
      if (!data.job || data.job.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["job"],
          message: "Job is required for crew.",
        });
      }
    }
    if (data.role === "CAST") {
      // For cast, character is required; job is optional (often 'Actor')
      if (!data.character || data.character.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["character"],
          message: "Character is required for cast.",
        });
      } // Order (inklusive relationer)
    }
  });

export type LinkPersonToMovieInput = z.infer<typeof linkPersonToMovieSchema>;

// --- Order Schemas ---
export const updateOrderStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"], {
    message: "Status must be PENDING, PROCESSING, SHIPPED, DELIVERED, or CANCELLED."
  }),
});

// User (endast de fält du använder i admin)
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable().optional(),
});

export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
});

export const orderItemSchema = z.object({
  id: z.number(),
  quantity: z.number(),
  priceAtPurchase: z.number(),
  movie: movieSchema,
});

export const orderSchema = z.object({
  id: z.number(),
  totalAmount: z.number(),
  status: z.string(),
  orderDate: z.string(),
  userId: z.string(),
  user: userSchema,
  createdAt: z.string(), // eller z.date()
  updatedAt: z.string(), // eller z.date()
  OrderItem: z.array(orderItemSchema),
});

// --- Checkout Order Schema ---
export const checkoutOrderSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  street: z.string().min(1, { message: "Street is required" }),
  zipcode: z.string().min(1, { message: "Zip code is required" }),
  city: z.string().min(1, { message: "City is required" }),
  email: z.string().email({ message: "Valid e-mail is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  items: z.array(
    z.object({
      movieId: z.number(),
      quantity: z.number().min(1),
      price: z.number().min(0),
    })
  ),
  totalAmount: z.number().min(0),
  // userId: z.string().optional(), // Avkommentera när vi har inloggning
});

export type CheckoutOrderInput = z.infer<typeof checkoutOrderSchema>;

export const updateMovieGenresSchema = z.object({
  movieId: z.number().int().positive(),
  genreIds: z
    .array(z.number().int().positive())
    .min(1, "Select at least one genre."),
});

export type UpdateMovieGenresInput = z.infer<typeof updateMovieGenresSchema>;
