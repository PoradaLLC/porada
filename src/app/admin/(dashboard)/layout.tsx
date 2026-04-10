import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080c10]">
        <div className="text-center">
          <p className="font-mono text-brand-accent text-lg">Supabase Not Configured</p>
          <p className="mt-2 font-mono text-sm text-brand-text">
            Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable admin.
          </p>
        </div>
      </div>
    );
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  const role = user.app_metadata?.role ?? user.user_metadata?.role;
  if (role !== "admin") redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-[#080c10]">
      <AdminSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
