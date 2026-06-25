"use client";

import { useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import PredictionForm from "@/components/PredictionForm";
import RiskGauge from "@/components/RiskGauge";
import { PredictionResult } from "@/lib/api";

export default function PredictPage() {
  const [result, setResult] = useState<PredictionResult | null>(null);

  return (
    <RequireAuth>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="font-data text-xs uppercase tracking-[0.2em] text-teal mb-3">
          New screening
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">
          Enter today&apos;s readings
        </h1>
        <p className="text-ink-soft mb-10">
          All eight fields are used by the model — leave nothing blank for an
          accurate read.
        </p>

        <div className="grid sm:grid-cols-[1fr] gap-10">
          <PredictionForm onResult={setResult} />

          {result && (
            <div className="rounded-xl border border-line bg-card p-8 flex flex-col items-center">
              <p className="font-data text-xs uppercase tracking-[0.15em] text-ink-soft mb-4">
                Result
              </p>
              <RiskGauge
                probability={result.probability}
                riskLevel={result.risk_level}
              />
              <p className="mt-4 text-sm text-ink-soft text-center max-w-sm">
                {result.risk_level === "High"
                  ? "This reading suggests an elevated likelihood of diabetes. Consider sharing it with a doctor."
                  : result.risk_level === "Moderate"
                  ? "This reading sits in a middle range. Worth tracking again soon."
                  : "This reading suggests a low likelihood of diabetes based on the model."}
              </p>
              <p className="mt-6 text-xs text-ink-soft">
                Saved to your history just now.
              </p>
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
