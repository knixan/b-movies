// Combine job/character entries per movie/person and merge field strings
// This is done to avoid showing multiple entries for the same movie/person in a carousel
// Niklas: This one is absolutely cursed and I barely understand how it works, ask GPT-5
// I wanted it to be generic so it can be used for both job and character merging in both person and movie contexts

// Usage examples:
// mergeByKey(items, "job", item => item.movie.id)
// mergeByKey(items, "character", item => item.person.id)

/**
 * Generic merge function to group items by a key and merge a string field.
 * @param items Array of items to merge
 * @param mergeField The field to merge (must be a string)
 * @param getKey Function to extract the grouping key from an item
 */
export function mergeByKey<T, K extends keyof T>(
  items: T[],
  mergeField: K,
  getKey: (item: T) => number | string
): T[] {
  return Object.values(
    items.reduce((acc, item) => {
      const id = getKey(item);
      const existing = acc[id];
      if (existing) {
        const merged = new Set([
          ...((typeof existing[mergeField] === "string"
            ? (existing[mergeField] as string).split(", ").filter(Boolean)
            : []) as string[]),
          ...((typeof item[mergeField] === "string"
            ? (item[mergeField] as string).split(", ").filter(Boolean)
            : []) as string[]),
        ]);
        (existing[mergeField] as T[K]) = Array.from(merged).join(", ") as T[K];
      } else {
        acc[id] = { ...item };
      }
      return acc;
    }, {} as Record<string | number, T>)
  );
}
