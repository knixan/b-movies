<div align="center">

<img src="public/images/bmovies-blue.png" alt="B-Movies Logo" width="120" />

# MovieShop Beta (B‑Movies)

Modern movie e‑commerce & catalog platform built with Next.js 15 (App Router). It demonstrates production‑style patterns for data modeling, authenticated flows, performant rendering, accessible component design, and composable server actions.

![MovieShop Beta Mockup](public/images/mockup-bmovies.jpg)

**Authors:** Josefine · Niklas · Amina

<br/>

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwind-css&logoColor=white) ![Auth](https://img.shields.io/badge/better--auth-Custom-green) ![License](https://img.shields.io/badge/License-Portfolio-lightgrey)

</div>

---

## Contents

1. [Overview](#overview)
2. [Feature Summary](#feature-summary)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Data Model](#data-model)
6. [Project Layout](#project-layout)
7. [Running Locally](#running-locally)
8. [Environment Variables](#environment-variables)
9. [Authentication](#authentication)
10. [Cart & Checkout](#cart--checkout)
11. [UI & Styling](#ui--styling)
12. [Accessibility](#accessibility)
13. [Performance Considerations](#performance-considerations)
14. [Roadmap](#roadmap)
15. [Contributing](#contributing)
16. [Team](#team)
17. [License](#license)

---

## Overview

MovieShop Beta (internally B‑Movies) is a pedagogical yet realistic implementation of a digital media storefront. It combines a relational schema (Prisma/PostgreSQL) with server‑first rendering and selective hydration. All mutating flows (catalog CRUD, cart operations, checkout) are modeled as type‑safe Server Actions to reduce REST overhead while preserving progressive enhancement and cache friendliness.

Key design tenets:

- Keep the client light; push logic to the server boundary.
- Prefer explicit schema & validation (Zod) over ad‑hoc runtime guards.
- Optimize for maintainability and extension (future payment, shipping, recommendations).
- Offer an auditable order trail with price immutability at purchase time.

---

## Feature Summary

User & Catalog
- Browse, filter, and search movies (title, genre, curated lists).
- View people (cast/crew) with associated filmography via junction modeling.
- Light/dark theme toggle persisted per user/device.

Commerce
- Cookie + server driven shopping cart (quantity mutation, removal, subtotal math).
- Checkout creating atomic Order + OrderItem records with snapshot pricing.
- Guest-style checkout fields (extensible to full customer profiles) plus authenticated linkage.

Authentication & Security
- Email/password auth via better-auth (session & account tables).
- Server + client helpers for session retrieval and gated UI branches.
- Role field prepared for future admin policies.

Administration
- Admin panels for Movies, Genres, People, and Orders (CRUD via forms & dialogs).

Content & Media
- Dynamic poster/backdrop/profile image URLs sourced from TMDB (no local image persistence).
- Defensive fallback imagery for absent assets.

Resilience & UX
- Empty states, loading transitions, and optimistic cart updates where safe.

---

## Tech Stack

| Category | Tooling |
|----------|---------|
| Framework | Next.js 15 (App Router, Server & Client Components) |
| Language | TypeScript 5 | 
| Styling | Tailwind CSS 4 + utility composition |
| UI Primitives | Radix + shadcn generated components |
| Forms & Validation | React Hook Form + Zod |
| ORM / DB | Prisma + PostgreSQL (BigInt support for TMDB IDs) |
| Auth | better-auth custom integration |
| Media Integration | TMDB (The Movie Database) poster/profile paths |
| State (Local) | Minimal React state, cookies, server actions |
| Icons | Lucide React |
| Theming | next-themes |

---

## System Architecture

High‑level flow:
1. Request enters App Router; static or dynamic segment loads.
2. Data fetched via Prisma inside Server Components or Server Actions.
3. Client Components hydrate only for interactive surfaces (dialogs, carousels, cart controls).
4. Cart state lives in an HTTP cookie; server action reads/mutates -> recalculates totals -> revalidates paths.
5. Checkout action performs transactional creation of Order + related OrderItems.

Patterns Employed
- Server Actions as the mutation layer.
- Schema‑driven validation (Zod) at action boundaries.
- Narrow client bundles (no global state library, no GraphQL overhead).
- Image URL construction helpers isolate TMDB specifics.
- Separation of domain (actions/lib) from presentation (components/app routes).

---

## Data Model

Core entities (see `prisma/schema.prisma`):

- Movie: pricing, stock, metadata, TMDB linkage, votes & rating.
- Person: cast/crew biography & optional life dates.
- MovieCrew: junction with role enum (CAST/CREW) + job/character ordering.
- Genre: unique name, optional description, many‑to‑many with Movie.
- Order & OrderItem: snapshot pricing (priceAtPurchase), quantity, status field (string now, easily upgradable to enum).
- User / Session / Account / Verification: better-auth expected tables with optional moderation fields (ban state).

Relational Integrity Notes
- `@@unique` composite key on MovieCrew prevents duplicate role/job/character tuples.
- BigInt usage for TMDB IDs avoids overflow for large external IDs.
- Cascading deletes on relations keep orphan data minimal.

---

## Project Layout

Focused excerpt:

```
prisma/          # Schema + migrations
public/images    # Static assets & placeholders
src/actions      # Server Actions (CRUD, domain mutations)
src/app          # Route segments (App Router)
src/cart         # Cookie + calculation utilities for cart
src/checkout     # Checkout server action(s)
src/components   # Reusable UI (forms, carousels, detail views, sheets)
src/lib          # Auth, prisma client, TMDB helpers, validation schemas
src/generated    # Prisma client output (configured path)
```

---

## Running Locally

Prerequisites
- Node.js 18+
- PostgreSQL database (local or container)
- TMDB API key

Clone & Install
```bash
git clone <YOUR_REPO_URL>
cd movieshop-beta
npm install
npx prisma generate
```

Database Setup (development)
```bash
npx prisma migrate dev --name init
```

Start Dev Server
```bash
npm run dev
```
Visit: http://localhost:3000

Production Build
```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env` file:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/movieshop"
TMDB_API_KEY="<your_tmdb_api_key>"
```
Optional future additions: `REDIS_URL`, `NEXT_PUBLIC_*` analytics keys, payment provider secrets.

---

## Authentication

Implemented with better-auth (session + account + verification tables) and custom server/client helpers.

Highlights
- Session retrieval inside Server Components for conditional rendering.
- Zod backed sign‑in / sign‑up forms (React Hook Form integration).
- Preparatory fields for role + banning / moderation logic.
- Email uniqueness enforced at DB layer.

Extensibility Paths
- Add OAuth providers by extending Account entries.
- Promote role to enum and gate admin segments.
- Introduce password reset & email verification flows leveraging `Verification` table.

---

## Cart & Checkout

Cart
- Stored as structured JSON in an HTTP cookie; server is source of truth for recalculated totals.
- Items optionally flagged if sourced from TMDB seeded data.
- Quantity guards & stock checks can be enforced centrally.

Checkout
- Single server action: validates cart snapshot, computes total, creates Order + OrderItems.
- Captures `priceAtPurchase` to decouple from later catalog price changes.
- Stores lightweight customer detail fields (upgrade path: normalized Address entity).

---

## UI & Styling

- Tailwind CSS 4 utilities + minimal custom layer.
- shadcn/ui generated components powered by Radix primitives (accessible by default).
- Theming with `next-themes` (class strategy) for zero‑FOUT dark/light switching.
- Carousels powered by Embla for smooth, low‑overhead interactions.

---

## Accessibility

- Radix handles focus trapping & ARIA attributes in dialogs, menus, sheets.
- Alt text fallbacks for missing posters/profiles.
- Logical heading hierarchy and keyboard navigable interactive elements.
- High contrast palette verified against dual themes.

---

## Performance Considerations

- Server Components avoid shipping data fetching & ORM logic to the client.
- Minimal client hydration scope (only interactive leaf components).
- Image sizes constrained via TMDB helper utilities to avoid over-fetching large assets.
- No global client state library (reduces bundle size & hydration cost).
- Potential future caching: incremental static regeneration or route segment caching for catalog lists.

---

## Roadmap

Planned / Nice‑to‑Have
- Payment provider integration & order status enum refinement.
- Address book + shipping calculation.
- Watchlist / favorites & recommendations (collaborative + popularity based).
- Inventory management (low stock alerts, soft deletes, restock events).
- Advanced search (faceting, fuzzy, multi‑field) potentially via Meilisearch/Elastic.
- Observability (structured logging, tracing, metrics).

---

## Contributing

We welcome educational and improvement PRs.

1. Fork repository
2. Create feature branch: `git checkout -b feat/<short-purpose>`
3. Commit with conventional prefix: `feat: add genre archive filter`
4. Push & open Pull Request describing rationale & screenshots if UI facing
5. Ensure: builds, lints, and migrations (if any) are included

Coding Guidelines
- Keep server action signatures small & validated.
- Prefer pure utilities in `lib/` with unit‑testable logic.
- Avoid duplicating data selection—extract selectors if reused.

---

## Team

| Member | Focus Areas |
|--------|-------------|
| Josefine | Frontend, UI/UX Design, Backend support, Logo & Visual Identity |
| Niklas | Frontend, Backend, API integration, Authentication architecture |
| Amina | Backend & Authentication flows |

---

## License

Portfolio / educational project. Not licensed for commercial reuse without permission from the authors.

---

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

---

Built using Next.js, Prisma, Tailwind, and modern web platform capabilities.</sub>

