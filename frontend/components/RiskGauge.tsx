const RISK_COLOR: Record<string, string> = {
  Low: "var(--color-green)",
  Moderate: "var(--color-amber)",
  High: "var(--color-coral)",
};

export default function RiskGauge({
  probability,
  riskLevel,
}: {
  probability: number;
  riskLevel: string;
}) {
  const radius = 90;
  const arcLength = Math.PI * radius; // length of a semicircle path
  const filled = Math.max(0, Math.min(1, probability)) * arcLength;
  const color = RISK_COLOR[riskLevel] ?? "var(--color-ink-soft)";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-56">
        <path
          d="M10,100 A90,90 0 0 1 190,100"
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M10,100 A90,90 0 0 1 190,100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${arcLength}`}
          style={{ transition: "stroke-dasharray 0.6s ease-out" }}
        />
        <text
          x="100"
          y="85"
          textAnchor="middle"
          className="font-data"
          fontSize="30"
          fill="var(--color-ink)"
        >
          {Math.round(probability * 100)}%
        </text>
      </svg>
      <p
        className="font-data text-xs uppercase tracking-[0.15em] mt-1"
        style={{ color }}
      >
        {riskLevel} risk
      </p>
    </div>
  );
}
