"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { KeyRound, Mail, X } from "lucide-react";
import { demoAccount, type PassportStamp } from "../venue";

export interface Account {
  name: string;
  email: string;
  giftBalance: number;
  passport: PassportStamp[];
}

interface AccountContextValue {
  user: Account | null;
  openSignIn: () => void;
  signIn: (email?: string) => void;
  signOut: () => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [open, setOpen] = useState(false);

  const openSignIn = useCallback(() => setOpen(true), []);
  const signIn = useCallback((email?: string) => {
    setUser({
      name: demoAccount.name,
      email: email?.trim() || demoAccount.email,
      giftBalance: demoAccount.giftBalance,
      passport: demoAccount.passport.map((p) => ({ ...p })),
    });
    setOpen(false);
  }, []);
  const signOut = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, openSignIn, signIn, signOut }),
    [user, openSignIn, signIn, signOut],
  );

  return (
    <AccountContext.Provider value={value}>
      {children}
      {open && <SignInModal onClose={() => setOpen(false)} onSubmit={signIn} />}
    </AccountContext.Provider>
  );
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within <AccountProvider>");
  return ctx;
}

function SignInModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState("");
  return (
    <div className="demo-overlay" onClick={onClose} data-tour="signin-modal">
      <div
        className="demo-rise demo-card w-full sm:max-w-md p-6 rounded-t-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Sign in"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl" style={{ color: "var(--parchment)" }}>
            <KeyRound size={18} style={{ color: "var(--brass)" }} /> Sign in or join
          </div>
          <button aria-label="Close" onClick={onClose} className="demo-btn demo-btn-ghost h-8 w-8 !p-0 rounded-lg">
            <X size={16} />
          </button>
        </div>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Track your best times, stamp your completionist passport, and save your gift-card balance.
        </p>
        <form
          className="mt-5 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(email);
          }}
        >
          <label className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
            Email
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted-2)" }}
            />
            <input
              type="email"
              className="demo-input !pl-9"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
            />
          </div>
          <button type="submit" className="demo-btn demo-btn-primary py-3 mt-1" data-tour="signin-submit">
            Continue
          </button>
          <p className="text-[0.7rem] text-center" style={{ color: "var(--muted-2)" }}>
            Demo only — no email is sent and nothing is stored.
          </p>
        </form>
      </div>
    </div>
  );
}
