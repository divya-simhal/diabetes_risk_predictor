"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(username, email, password);
    } catch {
      setError("That username or email is already registered.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <p className="font-data text-xs uppercase tracking-[0.2em] text-teal mb-3">
        Create account
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">
        Start tracking your risk
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-ink-soft mb-1.5" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            className="w-full rounded-md border border-line bg-card px-3 py-2.5 text-ink focus:border-teal outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-line bg-card px-3 py-2.5 text-ink focus:border-teal outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-md border border-line bg-card px-3 py-2.5 text-ink focus:border-teal outline-none"
          />
          <p className="mt-1.5 text-xs text-ink-soft">At least 6 characters.</p>
        </div>

        {error && (
          <p className="text-sm text-coral" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-teal px-4 py-2.5 text-white font-medium hover:bg-teal-dark transition-colors disabled:opacity-60"
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="text-teal font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
