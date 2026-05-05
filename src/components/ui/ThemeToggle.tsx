import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light mode" : "Dark mode"}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)] hover:border-[var(--color-border-strong)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
        className,
      )}
    >
      {dark ? (
        // Sun
        <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="10" cy="10" r="3.4" />
          <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.4 4.4l1.4 1.4M14.2 14.2l1.4 1.4M4.4 15.6l1.4-1.4M14.2 5.8l1.4-1.4" />
        </svg>
      ) : (
        // Moon
        <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16.5 12.4A6.5 6.5 0 1 1 7.6 3.5a5.5 5.5 0 0 0 8.9 8.9z" />
        </svg>
      )}
    </button>
  );
}
