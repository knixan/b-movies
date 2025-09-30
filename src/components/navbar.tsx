import Form from "next/form";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
// Note: Import client components directly; Next.js will handle the client boundary.

// Shadcn UI components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Custom components
import { ModeToggle } from "@/components/toggle-theme-button";
import ShoppingCartSheet from "./shopping-cart-sheet";

import { SignInAndProfile } from "./sign-in-and-profile";
import SignUpAndOut from "./sign-up-and-out";

export default async function Navbar() {
  const session = await getSession();
  const isLoggedIn: boolean = session ? true : false;

  // Used to generate the Top Lists dropdown and mobile menu
  const toplists = [
    { label: "Top 5 Popular Movies", id: "popular" },
    { label: "Top 5 Latest Movies", id: "latest" },
    { label: "Top 5 Oldest Movies", id: "oldest" },
    { label: "Top 5 Cheapest Movies", id: "cheapest" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 border-b border-border backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          {/* Two versions of the logo for light and dark mode */}
          <Image
            src="/images/bmovies.png"
            alt="B-Movies logo"
            width={600}
            height={600}
            className="h-12 w-auto hidden dark:block"
          />
          <Image
            src="/images/bmovies-blue.png"
            alt="B-Movies logo"
            width={600}
            height={600}
            className="h-12 w-auto block dark:hidden"
          />
        </Link>

        {/* SEARCH - CART - PROFILE - MOBILE BUTTON */}
        <div className="flex items-center lg:order-2 space-x-3">
          {/* Search field */}
          <div className="flex items-center space-x-2 flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <Form action="/movies" className="w-full">
              <Input
                type="search"
                name="q"
                placeholder="Search for movies..."
                className="w-full"
              />
              <button type="submit" hidden></button>
            </Form>
          </div>

          {/* THEME BUTTON */}
          <ModeToggle />

          {/* SHOPPING CART */}
          <ShoppingCartSheet />

          {/* PROFILE DROPDOWN - ENDAST DESKTOP */}
          <div className="hidden lg:block">
            <SignInAndProfile isLoggedIn={isLoggedIn} />
          </div>

          {/* SIGN UP BUTTON - ENDAST DESKTOP */}
          <div className="hidden lg:block">
            <SignUpAndOut isLoggedIn={isLoggedIn} />
          </div>

          {/* MOBILE MENU */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-xs">
              <MobileLinks toplists={toplists} isLoggedIn={isLoggedIn} />
            </SheetContent>
            <SheetTitle className="sr-only">menu</SheetTitle>
          </Sheet>
        </div>

        {/* NAVIGATION FOR DESKTOP */}
        <div className="hidden w-full lg:flex lg:w-auto lg:order-1 text-foreground items-center justify-between">
          <ul className="flex items-center font-medium space-x-3 lg:space-x-8">
            <li>
              <Link
                href="/"
                className="block text-md font-medium transition-colors hover:text-primary"
              >
                Home
              </Link>
            </li>
            <li className="relative">
              <Link
                href="/movies"
                className="block text-md font-medium transition-colors hover:text-primary"
              >
                Movies
              </Link>
            </li>
            <li>
              <Link
                href="/person"
                className="block text-md font-medium transition-colors hover:text-primary"
              >
                People
              </Link>
            </li>
            <li className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-md font-medium text-foreground hover:text-primary"
                  >
                    Top Lists
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {toplists.map((link) => (
                    <DropdownMenuItem key={link.id} asChild>
                      <Link href={`/#${link.id}`}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

// Mobile menu content
const MobileLinks = ({
  toplists,
  isLoggedIn,
}: {
  toplists: { label: string; id: string }[];
  isLoggedIn: boolean;
}) => (
  <div className="mt-4 p-6 flex flex-col space-y-2">
    <Link href="/" className="font-semibold text-primary text-lg">
      Home
    </Link>
    <Link href="/movies" className="font-semibold text-primary text-lg">
      Movies
    </Link>
    <Link href="/person" className="font-semibold text-primary text-lg">
      People
    </Link>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="justify-start px-0 text-foreground text-lg"
        >
          Top Lists
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        {toplists.map((link) => (
          <DropdownMenuItem key={link.id} asChild>
            <Link href={`#${link.id}`}>{link.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

    <div className="flex flex-col space-y-4 pt-4 border-t border-border mt-4">
      {/* SIGN UP BUTTON FOR MOBILE */}

      <SignUpAndOut isLoggedIn={isLoggedIn} />

      {/* SIGN IN BUTTON FOR MOBILE */}
      <SignInAndProfile isLoggedIn={isLoggedIn} />
    </div>
  </div>
);
