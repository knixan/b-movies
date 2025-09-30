"use client";

import React from "react";
import { MovieCrewWithMovie } from "./person-details";
import { PersonDetailsMovieCard } from "./person-details-movie-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { mergeByKey } from "@/lib/merge-by-key";

interface PersonDetailsCarouselProps {
  workedOn: MovieCrewWithMovie[];
}

// Component for displaying a carousel of movies on the person details page
export default function PersonDetailsCarousel({
  workedOn,
}: PersonDetailsCarouselProps) {
  // Filter the MovieCrew into cast and crew and merge duplicates
  const castMovies = mergeByKey(
    workedOn.filter((item) => item.role === "CAST"),
    "character",
    (item) => item.movie.id
  );
  const crewMovies = mergeByKey(
    workedOn.filter((item) => item.role === "CREW"),
    "job",
    (item) => item.movie.id
  );

  return (
    <div className="my-8 px-10">
      {castMovies.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Starred In
          </h2>
          <Carousel className="w-full max-w-7xl mx-auto">
            <CarouselContent className="-ml-1">
              {castMovies.map((movie) => (
                <CarouselItem
                  key={movie.id}
                  className="pl-1 basis-1/3 md:basis-1/4 lg:basis-1/6"
                >
                  <PersonDetailsMovieCard workedOn={movie} />
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
          <h2 className="text-2xl font-bold mb-4 text-foreground">Worked On</h2>
          <Carousel className="w-full max-w-7xl mx-auto">
            <CarouselContent className="-ml-1">
              {crewMovies.map((movie) => (
                <CarouselItem
                  key={movie.id}
                  className="pl-1 basis-1/3 md:basis-1/4 lg:basis-1/6"
                >
                  <PersonDetailsMovieCard workedOn={movie} />
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
