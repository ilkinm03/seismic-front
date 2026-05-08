import { Link, useLocation, useMatches } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BackendHealthDot } from "@/components/domain/BackendHealthDot";
import { Sep } from "@/components/ui/Sep";

interface BreadcrumbMeta {
  crumb?: string;
}

interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Topbar() {
  const matches = useMatches();
  const location = useLocation();
  const routeCrumbs = matches
    .filter((m) => (m.handle as BreadcrumbMeta)?.crumb)
    .map((m) => ({ label: (m.handle as BreadcrumbMeta).crumb! }));
  const crumbs: BreadcrumbItem[] =
    location.pathname.startsWith("/events/") && location.pathname !== "/events"
      ? [{ label: "Events", to: "/events" }, ...routeCrumbs]
      : routeCrumbs;

  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center border-b border-[var(--color-border)] bg-[var(--color-card)] px-8">
      {crumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="flex items-center gap-3">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <span key={i} className="flex items-center gap-3">
                {i > 0 && (
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 opacity-20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {c.to && !isLast ? (
                  <Link
                    to={c.to}
                    className="text-sm font-semibold tracking-tight text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast
                        ? "text-sm font-black tracking-tight text-[var(--color-fg)]"
                        : "text-sm font-semibold tracking-tight text-[var(--color-muted)]"
                    }
                  >
                    {c.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      )}

      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
