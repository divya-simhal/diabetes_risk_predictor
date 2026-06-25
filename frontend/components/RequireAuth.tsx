"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { username, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !username) {
      router.replace("/login");
    }
  }, [isLoading, username, router]);

  if (isLoading || !username) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center text-ink-soft">
        Checking your session…
      </div>
    );
  }

  return <>{children}</>;
}
