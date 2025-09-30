import { PersonCard } from "@/components/card-person";
import SearchBar from "@/components/search-bar";
import { prisma } from "@/lib/prisma";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis, // added
} from "@/components/ui/pagination";
import { getPaginationItems } from "@/lib/pagination";

// This page is similar to the MoviesPage but for persons
// It includes a search bar and displays persons in a grid layout
// The search functionality filters persons by name
export default async function PersonPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  // Extract and sanitize query parameters
  const query = params.q || "";
  const page = parseInt(params.page || "1");

  // Pagination settings
  const PAGE_SIZE = 24;
  const currentPage = Math.max(1, page);

  const persons = await prisma.person.findMany({
    orderBy: { name: "asc" },
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const totalPersons = await prisma.person.count({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
  });

  const totalPages = Math.ceil(totalPersons / PAGE_SIZE);

  // Href builder that preserves q and sets page
  const createPageHref = (p: number) => {
    const sp = new URLSearchParams();
    if (query) sp.set("q", query);
    sp.set("page", String(p));
    return `?${sp.toString()}`;
  };

  const paginationItems = getPaginationItems(totalPages, currentPage, 2); // adjust siblings as needed

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-sky-800 ">People</h1>
      <div className="mb-8 mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
        <div className="w-full">
          <SearchBar />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6  gap-6">
        {persons.length > 0 ? (
          persons.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No person matches your search.
          </p>
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={createPageHref(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : 0}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>

            {paginationItems.map((item, idx) =>
              item === "ellipsis" ? (
                <PaginationItem key={`e-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    href={createPageHref(item)}
                    isActive={currentPage === item}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href={createPageHref(Math.min(totalPages, currentPage + 1))}
                aria-disabled={currentPage === totalPages}
                tabIndex={currentPage === totalPages ? -1 : 0}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </main>
  );
}
