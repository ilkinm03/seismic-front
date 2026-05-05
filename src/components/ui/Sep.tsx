export function Sep({ vertical = false }: { vertical?: boolean }) {
  return vertical ? (
    <div className="h-full w-px self-stretch bg-[var(--color-border)]" />
  ) : (
    <div className="h-px w-full bg-[var(--color-border)]" />
  );
}
