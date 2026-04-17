"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Calendar,
  LogOut,
  Settings,
  Target,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/site/Logo";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/leads", label: "Lead Queue", icon: Target },
  { href: "/admin/emails", label: "Emails", icon: Mail },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

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
      <Link href="/admin" className="admin-sidebar-brand">
        <Logo size={22} />
        <b>SIERRA&nbsp;·&nbsp;117</b>
      </Link>
      <nav className="admin-sidebar-nav" aria-label="Admin">
        {navItems.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={active ? "active" : ""}>
              <item.icon aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar-foot">
        <div className="email" title={userEmail}>{userEmail || "—"}</div>
        <button type="button" className="signout" onClick={handleSignOut}>
          <LogOut aria-hidden="true" style={{ width: 13, height: 13 }} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
