"use client";

import { PredictionRecord } from "@/lib/api";

const RISK_COLOR: Record<string, string> = {
  Low: "text-green",
  Moderate: "text-amber",
  High: "text-coral",
};

export default function HistoryTable({
  records,
  onDelete,
}: {
  records: PredictionRecord[];
  onDelete: (id: number) => void;
}) {
  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-card p-10 text-center">
        <p className="text-ink-soft">
          No screenings yet. Run your first one from the Screen tab.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-card text-left text-ink-soft font-data text-xs uppercase tracking-wider">
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Glucose</th>
            <th className="px-4 py-3">BMI</th>
            <th className="px-4 py-3">Age</th>
            <th className="px-4 py-3">Probability</th>
            <th className="px-4 py-3">Risk</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b border-line bg-card/60">
              <td className="px-4 py-3 text-ink-soft">
                {new Date(record.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-data">{record.glucose}</td>
              <td className="px-4 py-3 font-data">{record.bmi}</td>
              <td className="px-4 py-3 font-data">{record.age}</td>
              <td className="px-4 py-3 font-data">
                {Math.round(record.probability * 100)}%
              </td>
              <td
                className={`px-4 py-3 font-medium ${
                  RISK_COLOR[record.risk_level]
                }`}
              >
                {record.risk_level}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(record.id)}
                  className="text-ink-soft hover:text-coral transition-colors text-xs"
                  aria-label="Delete this record"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
