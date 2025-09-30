import PersonDetails from "@/components/person-details";
import FetchExtraPersonInfo from "@/components/fetch-extra-person-info";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export type Params = {
  personId: string;
};

export default async function PersonPage(props: { params: Params }) {
  //Authorization
  const session = await getSession();
  const isAdmin = session?.user.role === "admin";

  const params = await props.params;
  const personId = parseInt(params.personId);

  if (isNaN(personId) || personId <= 0) {
    return redirect("/person");
  }

  const person = await prisma.person.findUnique({
    where: { id: personId },
    include: { movieCrew: { include: { movie: true } } },
  });

  if (!person) {
    return notFound();
  }

  // Do NOT run side effects during render.
  const needExtra = !person.birthday || !person.biography;

  return (
    <main className="relative min-h-screen flex items-center justify-center">
      <PersonDetails
        person={person}
        workedOn={person.movieCrew}
        isAdmin={isAdmin}
      />
      {/* Client-only helper: will call server action to fetch extra info and refresh */}
      <FetchExtraPersonInfo personId={person.id} needExtra={needExtra} />
      {/* Admin-only: Place LinkPersonToMovieForm next to an Edit panel when authenticated as admin */}
      {/* <div className="fixed bottom-6 right-6 w-[380px]">
        <LinkPersonToMovieForm personId={person.id} />
      </div> */}
    </main>
  );
}
