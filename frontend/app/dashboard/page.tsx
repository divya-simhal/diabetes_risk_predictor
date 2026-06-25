"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import StatsCharts from "@/components/StatsCharts";
import { fetchStats, Stats } from "@/lib/api";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-card p-6">
      <p className="font-data text-xs uppercase tracking-[0.15em] text-ink-soft mb-2">
        {label}
      </p>
      <p className="font-display text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <RequireAuth>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="font-data text-xs uppercase tracking-[0.2em] text-teal mb-3">
          Dashboard
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">
          Your screening summary
        </h1>
        <p className="text-ink-soft mb-10">
          Aggregated across every screening you&apos;ve run.
        </p>

        {isLoading || !stats ? (
          <p className="text-ink-soft">Loading…</p>
        ) : stats.total_predictions === 0 ? (
          <div className="rounded-xl border border-line bg-card p-10 text-center">
            <p className="text-ink-soft">
              Run a screening first — your dashboard will fill in from there.
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <StatCard
                label="Total screenings"
                value={String(stats.total_predictions)}
              />
              <StatCard
                label="High risk readings"
                value={String(stats.high_risk_count)}
              />
              <StatCard
                label="Avg. glucose"
                value={stats.average_glucose.toFixed(0)}
              />
            </div>

            <StatsCharts stats={stats} />
          </>
        )}
      </div>
    </RequireAuth>
  );
}
