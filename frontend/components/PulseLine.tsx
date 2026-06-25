export default function PulseLine({
  className = "",
  color = "var(--color-teal)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 600 80"
      className={`pulse-line w-full ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,40 L120,40 L145,40 L160,10 L180,70 L200,40 L230,40 L245,25 L260,55 L280,40 L600,40"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
