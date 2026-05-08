export function Dot({
  on = true,
  color = "var(--color-muted)",
  pulse = false,
  size = 6,
}: {
  on?: boolean;
  color?: string;
  pulse?: boolean;
  size?: number;
}) {
  return (
    <span
      className="relative inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: on ? color : "var(--color-border-strong)",
        boxShadow: on
          ? `0 0 0 2px color-mix(in oklch, ${color} 22%, transparent)`
          : "none",
      }}
    >
      {pulse && on ? (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: color,
            animation: "ring-pulse 1.6s ease-out infinite",
          }}
        />
      ) : null}
    </span>
  );
}
