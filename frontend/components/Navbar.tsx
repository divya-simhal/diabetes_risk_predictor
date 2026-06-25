"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const links = [
  { href: "/predict", label: "Screen" },
  { href: "/history", label: "History" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { username, logout, isLoading } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-ink flex items-center gap-2"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-teal" />
          Vitals
        </Link>

        {!isLoading && username && (
          <nav className="hidden sm:flex items-center gap-6 font-body text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname === link.href
                    ? "text-teal font-medium"
                    : "text-ink-soft hover:text-ink transition-colors"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 font-body text-sm">
          {isLoading ? null : username ? (
            <>
              <span className="hidden sm:inline text-ink-soft">
                {username}
              </span>
              <button
                onClick={logout}
                className="rounded-md border border-line px-3 py-1.5 text-ink hover:border-teal hover:text-teal transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-ink-soft hover:text-ink transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-teal px-3 py-1.5 text-white hover:bg-teal-dark transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
