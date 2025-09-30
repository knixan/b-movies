"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getProfileUrl } from "@/lib/tmdb-image-url";
import { MovieCrewWithPerson } from "./movie-details";

interface MovieDetailsPersonCardProps {
  workedOn: MovieCrewWithPerson;
}

// Card for a person on the movie details page
export function MovieDetailsPersonCard({
  workedOn,
}: MovieDetailsPersonCardProps) {
  const { person } = workedOn;
  const profile =
    getProfileUrl(person.profilePath, "h632") || "/images/default-profile.png";

  const personUrl = `/person/${person.id}`;

  return (
    <Card className="max-w-[200px] overflow-hidden rounded-lg hover:shadow-xl pt-3">
      <Link href={personUrl} className="block">
        <CardContent className="p-0 flex justify-center cursor-pointer">
          <Image
            src={profile}
            alt={person.name}
            width={180}
            height={270}
            style={{ objectFit: "cover" }}
            className="rounded-2xl px-2"
          />
        </CardContent>
      </Link>
      <CardFooter className="flex-col items-start px-4 py-0">
        <h3 className="mb-2 text-md font-semibold leading-tight truncate w-full">
          {person.name}
        </h3>
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
