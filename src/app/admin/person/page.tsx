import CreatePersonForm from "@/components/forms/create-person-form";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPersonPage() {
  await requireAdmin()
  
  return (
    <div className="flex justify-between gap-5">
      <CreatePersonForm />
    </div>
  );
}
