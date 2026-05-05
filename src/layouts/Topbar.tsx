import { useMatches } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BackendHealthDot } from "@/components/domain/BackendHealthDot";
import { Sep } from "@/components/ui/Sep";

interface BreadcrumbMeta {
  crumb?: string;
}

export function Topbar() {
  const matches = useMatches();
  const crumbs = matches
    .filter((m) => (m.handle as BreadcrumbMeta)?.crumb)
    .map((m) => (m.handle as BreadcrumbMeta).crumb!);

  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center border-b border-[var(--color-border)] bg-[var(--color-card)] px-8">
      {crumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="flex items-center gap-3">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <span key={i} className="flex items-center gap-3">
                {i > 0 && (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 opacity-20">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                )}
                <span
                  className={
                    isLast
                      ? "text-sm font-black tracking-tight text-[var(--color-fg)]"
                      : "text-sm font-semibold tracking-tight text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors cursor-default"
                  }
                >
                  {c}
                </span>
              </span>
            );
          })}
        </nav>
      )}
      
      <div className="ml-auto flex items-center gap-6">
        <div className="flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-card-elevated)] py-1.5 pl-4 pr-3 shadow-sm transition-all hover:shadow-md">
          <BackendHealthDot />
          <Sep className="h-4 opacity-20" />
          <div className="flex flex-col pr-1">
            <span className="text-[9px] font-bold uppercase tracking-tighter text-[var(--color-muted)] leading-none">System</span>
            <span className="text-[10px] font-black text-[var(--color-fg)] leading-tight">V3.1.4</span>
          </div>
        </div>
        
        <Sep className="h-8 opacity-10" />
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
