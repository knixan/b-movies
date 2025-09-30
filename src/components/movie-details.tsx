import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPosterUrl } from "@/lib/tmdb-image-url";
import { Genre, Movie, MovieCrew, Person } from "@/generated/prisma";
import { EditMoviePopup } from "./edit-movie-popup";
import MovieDetailsCarousel from "./movie-details-carousel";
import { AddToCartForm } from "./forms/add-to-cart-form";

export type MovieCrewWithPerson = MovieCrew & { person: Person };

interface MovieDetailsProps {
  movie: Movie;
  movieCrew: MovieCrewWithPerson[];
  genres: Genre[];
  allGenres: Genre[];
  isAdmin: boolean;
}

export default function MovieDetails({
  movie,
  movieCrew,
  genres,
  allGenres,
  isAdmin,
}: MovieDetailsProps) {
  const handlePoster =
    getPosterUrl(movie.posterPath, "w500") || "/default-image.jpg";

  return (
    <Card className="w-full mx-auto relative bg-background/20 backdrop-blur-xs border-border">
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20">
          <EditMoviePopup
            movie={movie}
            allGenres={allGenres ?? []}
            initialSelectedIds={genres.map((g) => g.id)}
          />
        </div>
      )}
      <CardContent className="relative z-10 flex flex-col md:flex-row p-4 md:p-8">
        {/* Left Section: Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center mb-4 md:mb-0 md:pr-4">
          <div className="relative w-full h-auto max-w-sm flex justify-center items-center">
            <Image
              src={handlePoster}
              alt={movie.title}
              width={400}
              height={600}
              className="rounded-lg shadow-2xl ring-1 ring-border"
            />
          </div>
        </div>

        {/* Right Section: Text and "Add to cart" */}
        <div className="w-full md:w-1/2 flex flex-col md:pl-4">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-4xl font-bold mb-2 text-foreground drop-shadow-lg">
              {movie.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base italic drop-shadow-sm">
              {genres.map((genre) => genre.name).join(", ")}
            </CardDescription>
          </CardHeader>

          <Separator className="mb-3 mt-0 bg-border" />
          <p className="mb-4 text-muted-foreground leading-relaxed drop-shadow-sm italic whitespace-pre-line">
            {movie.tagline}
          </p>
          <p className="mb-4 text-foreground leading-relaxed drop-shadow-sm whitespace-pre-line">
            {movie.overview}
          </p>

          <div className="space-y-2 mb-4 text-foreground">
            <p>
              Release Date:{" "}
              {movie.releaseDate
                ? movie.releaseDate.toLocaleDateString()
                : "Unknown"}
            </p>
            <p>{`Runtime: ${
              movie.runtime ? `${movie.runtime} minutes` : "Unknown"
            }`}</p>
            <p>{`Budget: ${movie.budget ? `$${movie.budget}` : "Unknown"}`}</p>
            <p>{`Revenue: ${
              movie.revenue ? `$${movie.revenue}` : "Unknown"
            }`}</p>
          </div>

          <Separator className="mb-4 mt-0 bg-border" />

          <div className="flex items-center text-2xl font-semibold mb-4 text-foreground">
            Price: {movie.price} SEK
          </div>

          {/* Quantity and Add to cart button */}
          <AddToCartForm
            movieId={movie.id}
            title={movie.title}
            price={movie.price}
            imageUrl={handlePoster}
            stock={movie.stock}
          />

          <p className="mt-4 text-sm text-muted-foreground">
            {(movie.stock ?? 0) > 0
              ? `${movie.stock} in stock`
              : "Out of stock"}
          </p>
        </div>
      </CardContent>
      {/* Carousel at the bottom, full width */}
      <div className="w-full">
        <MovieDetailsCarousel movieCrew={movieCrew} />
      </div>
    </Card>
  );
}
