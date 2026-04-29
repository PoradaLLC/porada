"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/site/Logo";

const navItems = [{ href: "/admin/leads", label: "Lead Queue", icon: Target }];

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="admin-sidebar">
      <Link href="/admin/leads" className="admin-sidebar-brand">
        <Logo size={22} />
        <b>PORADA</b>
      </Link>
      <nav className="admin-sidebar-nav" aria-label="Admin">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={active ? "active" : ""}>
              <item.icon aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar-foot">
        <div className="email" title={userEmail}>{userEmail || "-"}</div>
        <button type="button" className="signout" onClick={handleSignOut}>
          <LogOut aria-hidden="true" style={{ width: 13, height: 13 }} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
