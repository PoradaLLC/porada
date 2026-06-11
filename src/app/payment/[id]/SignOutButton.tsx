"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push(redirectTo ?? "/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button type="button" className="btn btn-ghost" onClick={handleClick} disabled={pending}>
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
