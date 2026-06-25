"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import HistoryTable from "@/components/HistoryTable";
import { deleteHistoryRecord, fetchHistory, PredictionRecord } from "@/lib/api";

export default function HistoryPage() {
  const [records, setRecords] = useState<PredictionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory()
      .then(setRecords)
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(id: number) {
    setRecords((prev) => prev.filter((record) => record.id !== id));
    try {
      await deleteHistoryRecord(id);
    } catch {
      // If the delete failed server-side, re-sync with the server.
      const fresh = await fetchHistory();
      setRecords(fresh);
    }
  }

  return (
    <RequireAuth>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="font-data text-xs uppercase tracking-[0.2em] text-teal mb-3">
          History
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">
          Past screenings
        </h1>
        <p className="text-ink-soft mb-10">
          Every reading you&apos;ve logged, most recent first.
        </p>

        {isLoading ? (
          <p className="text-ink-soft">Loading…</p>
        ) : (
          <HistoryTable records={records} onDelete={handleDelete} />
        )}
      </div>
    </RequireAuth>
  );
}
