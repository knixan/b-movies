import { requireAdmin } from "@/lib/auth"; // проверь путь
import { Button } from "@/components/ui/button";
import { addMoviesAndCrewFromTmdb } from "@/actions/api-actions";
import AddTmdbButton from "./add-tmdb-button";
import Link from "next/link";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <div className="flex justify-center">
      <div className="container mx-auto p-8 space-y-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-sky-600">Admin panel</h1>
        <p className="text-muted-foreground">
          Select an action to manage the store:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/movies">
            <Button className="w-full">Create movie</Button>
          </Link>

          <Link href="/admin/person">
            <Button className="w-full">Create person</Button>
          </Link>

          <Link href="/admin/orders">
            <Button className="w-full">Create order</Button>
          </Link>

          <Link href="/admin/genres">
            <Button className="w-full">Create genre</Button>
          </Link>

          <AddTmdbButton
            onAdd={async () => {
              "use server";
              await addMoviesAndCrewFromTmdb();
            }}
          />
        </div>
      </div>
    </div>
  );
}
