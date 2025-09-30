"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Used to map the sort query parameter for prisma
type SortCombo = {
  value: string;
  sort: string;
  order: "asc" | "desc";
  label: string;
};

// Sorting combos that can be selected by the user, should maybe be moved somewhere else
const SORT_COMBOS: SortCombo[] = [
  { value: "title_asc", sort: "title", order: "asc", label: "Title A → Z" },
  { value: "title_desc", sort: "title", order: "desc", label: "Title Z → A" },
  {
    value: "releaseDate_desc",
    sort: "releaseDate",
    order: "desc",
    label: "Newest first",
  },
  {
    value: "releaseDate_asc",
    sort: "releaseDate",
    order: "asc",
    label: "Oldest first",
  },
  {
    value: "rating_desc",
    sort: "rating",
    order: "desc",
    label: "Highest rated",
  },
  { value: "rating_asc", sort: "rating", order: "asc", label: "Lowest rated" },
  { value: "votes_desc", sort: "votes", order: "desc", label: "Most votes" },
  { value: "votes_asc", sort: "votes", order: "asc", label: "Fewest votes" },
];

// Component for picking the sort order of movies,
// updates the URL parameters like the search and genre filter
export default function SortPicker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "title";

  //Anything that is not "desc" is considered "asc"
  const currentOrder = (
    searchParams.get("order") === "desc" ? "desc" : "asc"
  ) as "asc" | "desc";

  // Find the current SORT_COMBOS value based on the current sort and order
  // Default to "title_asc" if not found
  const currentValue =
    SORT_COMBOS.find((c) => c.sort === currentSort && c.order === currentOrder)
      ?.value || "title_asc";

  // Update the URL parameters when the user selects a new sort option
  const handleChange = (value: string) => {
    const combo = SORT_COMBOS.find((c) => c.value === value);
    if (!combo) return;

    const params = new URLSearchParams(searchParams);
    params.set("sort", combo.sort);
    params.set("order", combo.order);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-xs">
      <Select value={currentValue} onValueChange={handleChange}>
        <SelectTrigger aria-label="Sort movies" className="w-full">
          <SelectValue placeholder="Sort..." />
        </SelectTrigger>
        <SelectContent>
          {SORT_COMBOS.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
