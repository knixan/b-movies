"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProfileUrl } from "@/lib/tmdb-image-url";
import { Person } from "@/generated/prisma";

interface PersonDetailsProps {
  person: Person;
}

// Component showing a card for a person
export function PersonCard({ person }: PersonDetailsProps) {
  const { profilePath, name, id } = person;

  const profile =
    getProfileUrl(profilePath, "h632") || "/images/default-profile.png";

  return (
    <Card className="max-w-xs overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl py-3">
      <CardContent className="p-0">
        {/* Profile Picture */}
        <Image
          src={profile}
          alt={name}
          width={421}
          height={632}
          style={{ objectFit: "cover" }}
          className="rounded-3xl px-3"
        />
      </CardContent>
      <CardFooter className="flex-col items-start p-4 pt-2 pb-0">
        <h3 className="text-md font-semibold leading-tight">{name}</h3>
        {/* "Read more" link to the dynamic page */}
        <Link href={`/person/${id}`} className="mt-4 w-full">
          <Button variant="outline" className="w-full">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
