"use client";

import React from "react";
import { MovieCrewWithPerson } from "./movie-details";
import { MovieDetailsPersonCard } from "./movie-details-person-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { mergeByKey } from "@/lib/merge-by-key";

interface MovieDetailsCarouselProps {
  movieCrew: MovieCrewWithPerson[];
}

// Component for displaying a carousel of people on the movie details page
export default function MovieDetailsCarousel({
  movieCrew,
}: MovieDetailsCarouselProps) {
  // Filter the MovieCrew into cast and crew and merge duplicates
  const castMovies = mergeByKey(
    movieCrew.filter((item) => item.role === "CAST"),
    "character",
    (item) => item.person.id
  );
  const crewMovies = mergeByKey(
    movieCrew.filter((item) => item.role === "CREW"),
    "job",
    (item) => item.person.id
  );

  return (
    <div className="my-8 px-10">
      {castMovies.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4 text-foreground">Cast</h2>
          <Carousel className="w-full max-w-7xl mx-auto">
            <CarouselContent className="-ml-1">
              {castMovies.map((movie) => (
                <CarouselItem
                  key={movie.id}
                  className="pl-1 basis-1/2 md:basis-1/4 lg:basis-1/6"
                >
                  <MovieDetailsPersonCard workedOn={movie} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </>
      )}

      {crewMovies.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-4 text-foreground">Crew</h2>
          <Carousel className="w-full max-w-7xl mx-auto">
            <CarouselContent className="-ml-1">
              {crewMovies.map((movie) => (
                <CarouselItem
                  key={movie.id}
                  className="pl-1 basis-1/3 md:basis-1/4 lg:basis-1/6"
                >
                  <MovieDetailsPersonCard workedOn={movie} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </>
      )}
    </div>
  );
}
