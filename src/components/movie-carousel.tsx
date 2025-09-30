"use client";
import { Movie } from "@/generated/prisma";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { MovieCard } from "./card-movies";
// Component for displaying a carousel of movies
export default function MovieCarousel({
  movies,
  title,
  id,
}: {
  movies: Movie[];
  title: string;
  id: string;
}) {
  return (
    <div className="my-8" id={id}>
      <h2 className="text-3xl font-bold mb-4 text-foreground">{title}</h2>
      <Carousel className="w-full  max-w-7xl mx-auto">
        <CarouselContent className="-ml-1">
          {movies.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="pl-1  basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <div className="p-1">
                <MovieCard movie={movie} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
