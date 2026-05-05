export function Spinner({ size = 14 }: { size?: number }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border border-[var(--color-border-strong)] border-t-[var(--color-fg)]"
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    />
  );
}
