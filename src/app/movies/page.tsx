import { MovieCard } from "@/components/card-movies";
import GenreFilter from "@/components/genre-filter";
import SearchBar from "@/components/search-bar";
import SortPicker from "@/components/sort-picker";
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
import { getPaginationItems } from "@/lib/pagination"; // added

// These are used to map the sort query parameter for prisma
const SORT_MAP = {
  title: "title",
  releaseDate: "releaseDate",
  rating: "rating",
  votes: "votes",
};

// This page displays a list of movies with search, genre filter, and sorting options
export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    genre?: string;
    sort?: string;
    order?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  // Extract and sanitize query parameters
  const query = params.q || "";
  const selectedGenre = params.genre || "";
  const sort = (params.sort as keyof typeof SORT_MAP) || "title";
  const page = parseInt(params.page || "1");

  // Default to ascending order if not specified or invalid
  const sortOrder = params.order === "desc" ? "desc" : "asc";

  // Maps the sort query to the sort map so we are guaranteed to have a valid field
  const sortField = SORT_MAP[sort] || "title";

  // Pagination settings
  const PAGE_SIZE = 24;
  const currentPage = Math.max(1, page); // Avoid pages less than 1

  // Fetch all genres for the genre filter dropdown
  const genres = await prisma.genre.findMany({
    orderBy: { name: "asc" },
  });

  // Fetch movies from the database, optionally filtering by search query and genre
  // The selectedGenre filter is only applied if a genre is selected (not an empty string)
  // The order and sorting is handled by the SortPicker component, which updates the URL parameters
  // Pagination is handled by skipping and taking a subset of movies based on the current page
  const movies = await prisma.movie.findMany({
    orderBy: { [sortField]: sortOrder },
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
      ...(selectedGenre
        ? {
            genres: {
              some: { name: selectedGenre },
            },
          }
        : {}),
    },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  // Fetch total count of movies for pagination
  const totalMovies = await prisma.movie.count({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
      ...(selectedGenre
        ? {
            genres: {
              some: { name: selectedGenre },
            },
          }
        : {}),
    },
  });

  const totalPages = Math.ceil(totalMovies / PAGE_SIZE);

  // Build href while preserving existing query params
  const createPageHref = (p: number) => {
    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (!value || key === "page") continue;
      sp.set(key, value);
    }
    sp.set("page", String(p));
    return `?${sp.toString()}`;
  };

  // Windowed pagination with 2 siblings on each side
  const paginationItems = getPaginationItems(totalPages, currentPage, 2);

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-primary">Our Movies</h1>
      <div className="mb-8 mt-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex-1 min-w-[300px]">
            <SearchBar />
          </div>
          <div>
            <GenreFilter genres={genres} selectedGenre={selectedGenre} />
          </div>
          <div>
            <SortPicker />
          </div>
        </div>
      </div>
      {/* film grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6  gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No movies match your search.
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
