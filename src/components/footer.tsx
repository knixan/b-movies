"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Building2,
  ArrowUp,
  Film,
  UserCircle2,
  Github,
  Info,
  SquareStack,
  Mail
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ContactForm from "@/components/forms/contact-form";

export function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // No console logging in production footer – keep minimal.

  // Initial (pre-hydration) render – keep simple to avoid mismatch
  if (!mounted) {
    return (
      <footer className="bg-background/95 border-t border-border backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
        <div className="mx-auto max-w-screen-xl p-8">
          <div className="flex items-center justify-center">
            <Image
              src="/images/bmovies.png"
              alt="B-Movies logo"
              width={120}
              height={120}
              className="h-14 w-auto"
            />
          </div>
        </div>
        <div className="border-t border-border py-4 text-center">
          <p className="text-xs text-muted-foreground tracking-wide">
            ©2025 B-Movies
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-background/95 border-t border-border backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="mx-auto max-w-screen-xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="space-y-4 col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={theme === "light" ? "/images/bmovies-blue.png" : "/images/bmovies.png"}
                alt="B-Movies logo"
                width={140}
                height={140}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed pr-4">
              A curated B-Movie store built with modern web
              technologies for a performant and delightful shopping experience.
            </p>
          </div>

            {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide flex items-center gap-2"><Film className="h-4 w-4" /> Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-primary transition-colors" href="/movies">Movies</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/person">People</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/orders">My Orders</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/project-presentation">Project Presentation</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/aboutus">About Us</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide flex items-center gap-2"><UserCircle2 className="h-4 w-4" /> Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-primary transition-colors" href="/sign-in">Sign In</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/sign-up">Create Account</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/settings">Settings</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/checkout">Checkout</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide flex items-center gap-2"><SquareStack className="h-4 w-4" /> Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-primary transition-colors" href="/#latest">Top 5 Latest</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/#popular">Top 5 Popular</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/#oldest">Top 5 Oldest</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/#cheapest">Top 5 Cheapest</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide flex items-center gap-2"><Info className="h-4 w-4" /> Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" /> <span>1313 Swamp Lagoon Drive<br />Bayou Heights, FL 66613</span></li>
              <li className="flex items-start gap-2"><Building2 className="h-4 w-4 mt-0.5" /> <span>Opposite Coach Gator&apos;s Haunted Gymnasium</span></li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> <span>(555) CHOMP-333</span></li>
              <li>
                <Dialog>
                  <DialogTrigger className="inline-flex items-center gap-2 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" /> Contact Us
                  </DialogTrigger>
                  <DialogContent className="p-0 sm:max-w-2xl">
                    <DialogTitle className="sr-only">Contact Form</DialogTitle>
                    <div className="max-h-[80vh] overflow-auto p-4 sm:p-6">
                      <ContactForm variant="dialog" />
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowUp className="h-4 w-4" /> Back to top
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center px-4">
        <p className="text-xs md:text-sm text-muted-foreground tracking-wide">
          ©2025 B-Movies • Built by Niklas • Josefine • Amina
        </p>
      </div>
    </footer>
  );
}
