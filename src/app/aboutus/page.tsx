import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Globe } from "lucide-react";

const members = [
  {
    name: "Josefine",
    role: "Fullstack Developer focusing on Frontend, Graphics and Logodesign",
    bio: "Responsible for UI components and implementing responsive design. Built movie cards, carousel, landing page, and navigation menu. Customer support contact sheet. Developed shopping cart with cookies and local storage, checkout system, custom orders and settings as well as admin pages for genres and orders, including Zod validation. Designed the logo and overall site aesthetics.",
    image: "/images/josefine.png",
    github: "GITHUB_LINK",
    linkedin: "https://www.linkedin.com/in/josefine-eriksson-349498345/",
    website: "https://kodochdesign.se/",
  },
  {
    name: "Niklas",
    role: "Fullstack Developer focused on the Backend, Form Validation, TMDB API integration, Search, Filtering and Pagination",
    bio: "Created and managed the integration with the TMDB API. Responsible for backend logic, schema design and database integration. Was involved in a lot of form handling, wrote the Prisma schema and helped out with Zod validation for the forms and backend. Responsible for a lot of front end logic, in particular the search, filtering and pagination functionality on the browse pages.",
    image: "/images/default-profile.png",
    github: "https://github.com/niklastallund",
  },
  {
    name: "Amina",
    role: "Fullstack Developer focusing on security & authentication",
    bio: "Responsible for movie admin panel and authentication. Implemented security measures and user management systems using better-auth and Zod schemas.",
    image: "/images/aminat.png",
    github: "https://github.com/AminaDev13",
    linkedin: "https://www.linkedin.com/in/aminat-balieva-78bb2a164/",
    website: "https://portfolioamina.vercel.app/",
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto py-16 px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-4xl mb-10 font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            About Us
          </h1>
          <p className="text-xl mt-10 text-muted-foreground max-w-3xl mx-auto">
            We who have built B-Movies
          </p>
        </div>

        {/* Team Members */}
        <div className="space-y-20">
          {members.map((member, index) => (
            <div
              key={member.name}
              className={`relative ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Background Card */}
              <div className="bg-card rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm border">
                <div
                  className={`flex flex-col lg:flex-row items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image Section */}
                  <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col items-center">
                    <div className="relative">
                      {/* Decorative background */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-primary/50 via-primary/30 to-secondary/50 rounded-full blur-lg opacity-30 animate-pulse"></div>

                      {/* Profile Image */}
                      <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-background shadow-2xl">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                          sizes="(max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
                        />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-6 mt-8">
                      {member.github && (
                        <Link
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                          <Github size={24} className="text-foreground" />
                        </Link>
                      )}
                      {member.linkedin && (
                        <Link
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                          <Linkedin size={24} className="text-primary" />
                        </Link>
                      )}
                      {member.website && (
                        <Link
                          href={member.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-accent hover:bg-accent/80 transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                          <Globe size={24} className="text-accent-foreground" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Text Section */}
                  <div className="w-full lg:w-1/2 p-8 lg:p-12">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
                          {member.name}
                        </h2>
                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full text-sm font-medium mb-6">
                          {member.role}
                        </div>
                      </div>

                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-muted-foreground leading-relaxed text-lg">
                          {member.bio}
                        </p>
                      </div>

                      {/* Decorative element */}
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="w-2 h-2 bg-primary/70 rounded-full"></div>
                        <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="text-center mt-20 pt-12 border-t">
          <p className="text-muted-foreground text-lg">
            Together we have created this movie platform.
          </p>
        </div>
      </div>
    </div>
  );
}
