import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getProfileUrl } from "@/lib/tmdb-image-url";
import { Movie, MovieCrew, Person } from "@/generated/prisma";
import { EditPersonPopup } from "./edit-person-popup";
import PersonDetailsCarousel from "./person-details-carousel";

// Extended type so we can include movie details
export type MovieCrewWithMovie = MovieCrew & { movie: Movie };

interface PersonDetailsProps {
  person: Person;
  workedOn: MovieCrewWithMovie[];
  isAdmin: boolean;
}

function getAgeAtDeath(birthday: Date, deathday: Date): number {
  let age = deathday.getFullYear() - birthday.getFullYear();
  const deathMonth = deathday.getMonth();
  const birthMonth = birthday.getMonth();
  const deathDate = deathday.getDate();
  const birthDate = birthday.getDate();

  // If deathday is before birthday in the year, subtract one
  if (
    deathMonth < birthMonth ||
    (deathMonth === birthMonth && deathDate < birthDate)
  ) {
    age--;
  }
  return age;
}

export default function PersonDetails({
  person,
  workedOn,
  isAdmin,
}: PersonDetailsProps) {
  const handlePoster =
    getProfileUrl(person.profilePath, "h632") || "/images/default-profile.png";

  return (
    <Card className="w-full mx-auto relative">
      {/* Place EditPersonPopup absolutely in the top right */}
      <div className="absolute top-4 right-4 z-20">
        {isAdmin && <EditPersonPopup person={person} />}
      </div>
      <CardContent className="relative z-10 flex flex-col md:flex-row p-4 md:p-8">
        <div className="w-full md:w-1/2 flex items-center justify-center mb-4 md:mb-0 md:pr-4">
          <div className="relative w-full h-auto max-w-sm flex justify-center items-center">
            <Image
              src={handlePoster}
              alt={person.name}
              width={400}
              height={600}
              className="rounded-lg shadow-2xl ring-1 ring-white/20"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col md:pl-4">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-4xl font-bold mb-2 text-foreground drop-shadow-lg">
              {person.name}
            </CardTitle>
          </CardHeader>
          <div className="space-y-2 mb-4 text-foreground">
            <p>
              Birthdate:{" "}
              <span className="text-muted-foreground">
                {person.birthday
                  ? person.birthday.toLocaleDateString()
                  : "Unknown"}
              </span>
            </p>
            {person.deathday && (
              <p>
                Day of death:{" "}
                <span className="text-muted-foreground">
                  {person.deathday.toLocaleDateString()}{" "}
                  {person.birthday &&
                    `(aged ${getAgeAtDeath(person.birthday, person.deathday)})`}
                </span>
              </p>
            )}
          </div>
          <p className="mb-4 text-muted-foreground leading-relaxed drop-shadow-sm italic whitespace-pre-line">
            {person.biography || "No biography available."}
          </p>
          <Separator className="my-4 bg-border" />
        </div>
      </CardContent>
      {/* Carousel at the bottom, full width */}
      <div className="w-full">
        <PersonDetailsCarousel workedOn={workedOn} />
      </div>
    </Card>
  );
}
