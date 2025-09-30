import CreateMovieForm from "@/components/forms/create-movies-form";
import {  requireAdmin } from "@/lib/auth";


//Authorization
export default async function AdminMoviesPage() {
  await requireAdmin();

  return (
    <div className="container mx-auto p-8 space-y-10">
      <CreateMovieForm />
    </div>
  );
}
