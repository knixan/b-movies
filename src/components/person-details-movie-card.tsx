"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getPosterUrl } from "@/lib/tmdb-image-url";
import { MovieCrewWithMovie } from "./person-details";
import Link from "next/link";

interface PersonDetailsMovieCardProps {
  workedOn: MovieCrewWithMovie;
}

// Component showing a card for a movie
export function PersonDetailsMovieCard({
  workedOn,
}: PersonDetailsMovieCardProps) {
  const handlePoster =
    getPosterUrl(workedOn.movie.posterPath, "w342") || "/default-image.jpg";

  const movieUrl = `/movies/${workedOn.movie.id}`;

  return (
    <Card className="max-w-[200px] overflow-hidden rounded-lg hover:shadow-xl pt-3">
      <Link href={movieUrl} className="block">
        <CardContent className="p-0 flex justify-center cursor-pointer">
          {/* Movie image */}
          <Image
            src={handlePoster}
            alt={workedOn.movie.title}
            width={180}
            height={270}
            style={{ objectFit: "cover" }}
            className="rounded-2xl px-2"
          />
        </CardContent>
      </Link>
      <CardFooter className="flex-col items-start px-4 py-0">
        {/* Movie title */}
        <h3 className="mb-2 text-md font-semibold leading-tight truncate w-full">
          {workedOn.movie.title}
        </h3>
        {/* Role-dependent field */}
        {workedOn.role === "CREW" && workedOn.job && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {workedOn.job}
          </p>
        )}
        {workedOn.role === "CAST" && workedOn.character && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {workedOn.character}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
