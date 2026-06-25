"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Stats } from "@/lib/api";

const RISK_COLORS: Record<string, string> = {
  Low: "#2f8f5b",
  Moderate: "#c98a1f",
  High: "#d7572d",
};

const FEATURE_LABELS: Record<string, string> = {
  pregnancies: "Pregnancies",
  glucose: "Glucose",
  blood_pressure: "Blood pressure",
  skin_thickness: "Skin thickness",
  insulin: "Insulin",
  bmi: "BMI",
  diabetes_pedigree_function: "Pedigree function",
  age: "Age",
};

export default function StatsCharts({ stats }: { stats: Stats }) {
  const riskData = Object.entries(stats.risk_distribution).map(
    ([level, count]) => ({ level, count })
  );

  const importanceData = stats.feature_importance.map((item) => ({
    feature: FEATURE_LABELS[item.feature] ?? item.feature,
    importance: Math.abs(item.importance),
    direction: item.importance >= 0 ? "Increases risk" : "Decreases risk",
  }));

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="rounded-xl border border-line bg-card p-6">
        <p className="font-data text-xs uppercase tracking-[0.15em] text-ink-soft mb-4">
          Risk distribution
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={riskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe2db" vertical={false} />
            <XAxis dataKey="level" tick={{ fill: "#4a5a52", fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: "#4a5a52", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderColor: "#dbe2db",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {riskData.map((entry) => (
                <Cell key={entry.level} fill={RISK_COLORS[entry.level]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-line bg-card p-6">
        <p className="font-data text-xs uppercase tracking-[0.15em] text-ink-soft mb-4">
          What drives the model
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={importanceData} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe2db" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#4a5a52", fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="feature"
              width={110}
              tick={{ fill: "#4a5a52", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderColor: "#dbe2db",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value, _name, props) => [
                typeof value === "number" ? value.toFixed(3) : value,
                props?.payload?.direction,
              ]}
            />
            <Bar dataKey="importance" fill="#1f6f5c" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
