import { prisma } from "@/lib/prisma";
import MovieCarousel from "./movie-carousel";
import { Movie } from "@/generated/prisma";

export default async function Carousels() {
  // Fetch all the movies in parallel with a single promise
  const [latest, popular, oldest, cheapest]: [
    Movie[],
    Movie[],
    Movie[],
    Movie[]
  ] = await Promise.all([
    prisma.movie.findMany({ orderBy: { releaseDate: "desc" }, take: 10 }),
    prisma.movie.findMany({ orderBy: { votes: "desc" }, take: 10 }),
    prisma.movie.findMany({ orderBy: { releaseDate: "asc" }, take: 10 }),
    prisma.movie.findMany({ orderBy: { price: "asc" }, take: 10 }),
  ]);

  return (
    <div className="space-y-12 ">
      <MovieCarousel movies={popular} id="popular" title="Popular Movies" />
      <MovieCarousel movies={latest} id="latest" title="Latest Movies" />
      <MovieCarousel movies={oldest} id="oldest" title="Oldest Movies" />
      <MovieCarousel movies={cheapest} id="cheapest" title="Cheapest Movies" />
    </div>
  );
}
