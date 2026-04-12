"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Terminal,
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Calendar,
  LogOut,
  Settings,
  Target,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/leads", label: "Lead Queue", icon: Target },
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
    <aside className="flex h-screen w-64 flex-col border-r border-white/5 bg-[#060a0e]">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/10 border border-brand-accent/20">
          <Terminal className="h-4 w-4 text-brand-accent" />
        </div>
        <span className="font-mono text-sm font-bold text-white">
          SCHTUBBS
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-sm transition-colors ${
                isActive
                  ? "bg-brand-accent/15 text-brand-accent"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/5 px-4 py-4">
        <p className="font-mono text-xs text-white/30 truncate mb-2">
          {userEmail}
        </p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 font-mono text-xs text-white/40 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
