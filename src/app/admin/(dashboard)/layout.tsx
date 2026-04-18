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
      <div className="admin-login-shell">
        <div className="admin-login-card">
          <h1>Supabase not configured</h1>
          <p className="hint" style={{ marginTop: 12 }}>
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
    <div className="admin-shell">
      <AdminSidebar userEmail={user.email ?? ""} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
