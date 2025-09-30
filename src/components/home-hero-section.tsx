"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function HeroSection() {
  useEffect(() => {
    // ...your animation logic...
    const mainHeading = document.getElementById("main-heading");
    const subHeading = document.getElementById("sub-heading");
    const mainHeadingMobile = document.getElementById("main-heading-mobile");
    const subHeadingMobile = document.getElementById("sub-heading-mobile");

    setTimeout(() => {
      if (mainHeading) {
        mainHeading.classList.remove("translate-y-full", "opacity-0");
        mainHeading.classList.add("translate-y-0", "opacity-100");
      }
      if (subHeading) {
        subHeading.classList.remove("translate-y-full", "opacity-0");
        subHeading.classList.add("translate-y-0", "opacity-100");
      }
      if (mainHeadingMobile) {
        mainHeadingMobile.classList.remove("translate-y-full", "opacity-0");
        mainHeadingMobile.classList.add("translate-y-0", "opacity-100");
      }
      if (subHeadingMobile) {
        subHeadingMobile.classList.remove("translate-y-full", "opacity-0");
        subHeadingMobile.classList.add("translate-y-0", "opacity-100");
      }
    }, 800);
  }, []);

  return (
    <div>
      {/* HERO för DESKTOP */}
      <section
        id="desktop-hero"
        className="relative h-screen w-screen hidden md:flex flex-col justify-center items-center text-center px-4 bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/hero1.png")' }}
      >
        <div className="absolute inset-0 bg-background opacity-60"></div>
        <div className="z-10 relative">
          <h1
            id="main-heading"
            className="text-5xl md:text-7xl font-extrabold mb-4 mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 transform translate-y-full opacity-0 transition-all duration-1000 ease-out"
          >
            Discover the Best B-Movies
          </h1>
          <p
            id="sub-heading"
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 transform translate-y-full opacity-0 transition-all duration-1000 ease-out"
          >
            Dive into a world of weird, scary, and fantastically entertaining
            films that never made it to the A-list.
          </p>
          <Link href="#section3" className="inline-block">
            <Button className="px-8 py-4 rounded-lg font-bold text-lg bg-primary hover:bg-primary/90 transform transition-transform duration-300 hover:scale-105">
              Top 5 Movies
            </Button>
          </Link>
        </div>
      </section>

      {/* HERO för MOBIL */}
      <section
        id="mobile-hero"
        className="flex flex-col p-4 md:hidden w-screen items-center text-center"
      >
        <div className="w-full flex flex-col justify-center items-center p-2 text-center">
          <h1
            id="main-heading-mobile"
            className="text-5xl font-extrabold p-4 mb-4 text-primary transform translate-y-full opacity-0 transition-all duration-1000 ease-out"
          >
            Discover the Best B-Movies
          </h1>
          <p
            id="sub-heading-mobile"
            className="text-lg max-w-3xl mx-auto p-4 mb-8 text-foreground transform translate-y-full opacity-0 transition-all duration-1000 ease-out"
          >
            Dive into a world of weird, scary, and fantastically entertaining
            films that never made it to the A-list.
          </p>
        </div>

        <div className="relative p-4 w-full h-auto ">
          <Image
            src="/images/hero1mobil.png"
            alt="Hero image of B-movies"
            width={1920}
            height={1080}
            layout="responsive"
            objectFit="contain"
            quality={100}
            className="rounded-lg"
          />
        </div>
      </section>
    </div>
  );
}
