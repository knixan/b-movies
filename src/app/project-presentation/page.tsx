import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Project Presentation | B-Movies",
  description: "Overview of the B-Movies (MovieShop Beta) architecture and features.",
};

export default function ProjectPresentationPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Project Presentation: B-Movies
        </h1>
        <p className="text-muted-foreground">
          MovieShop Beta is a modern movie e-commerce experience built with a clean, fast, and component-driven architecture.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Core Stack</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Next.js (App Router, Server & Client Components)</li>
              <li>TypeScript</li>
              <li>Tailwind CSS + shadcn/ui component primitives</li>
              <li>Prisma ORM with a relational database</li>
              <li>Custom authentication layer (session-based)</li>
              <li>Lucide icons</li>
              <li>Image delivery via TMDB poster paths (on-demand, no file storage)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Secure user authentication (sign in dialog + profile dropdown)</li>
              <li>Settings page with profile + extensible account management</li>
              <li>Order history page (My Orders) with per-order detail dialog</li>
              <li>Structured order model with line items & pricing snapshots</li>
              <li>Interactive order details popup (no PDFs, no external libs)</li>
              <li>Checkout success flow reused for order specification</li>
              <li>Movie browsing with poster thumbnails & graceful fallbacks</li>
              <li>Responsive, accessible UI components</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Architecture Highlights</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Server Actions for secure mutations (profile + orders)</li>
              <li>Lean server components for data fetching</li>
              <li>Client components only where interactivity is needed</li>
              <li>Composable UI using shadcn patterns (Dialog, Card, Button)</li>
              <li>Consistent design tokens via Tailwind utilities</li>
              <li>Defensive rendering & empty states</li>
              <li>Clear separation of concerns (forms, actions, display)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extensibility</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Profile ready for firstName / lastName expansion</li>
              <li>Future-ready contact & shipping details module</li>
              <li>Scalable order detail model (status, timestamps)</li>
              <li>Reusable dialog patterns (tracking, re-ordering)</li>
              <li>Potential for recommendations & loyalty features</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>UX Principles</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Minimal friction (inline dialogs vs redirects)</li>
              <li>Clear visual hierarchy & semantic iconography</li>
              <li>Fast perceived performance</li>
              <li>Predictable navigation structure</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Value & Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              This foundation accelerates adding features like saved addresses, re-ordering,
              recommendations, payment history, and watchlists without refactoring core systems.
            </p>
            <p className="font-medium">Concise, scalable, and production-aligned.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
