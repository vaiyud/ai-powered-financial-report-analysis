import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Welcome back, {user.email}. Your session is active.
      </p>
    </div>
  );
}
