import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";

interface NavItem {
  to: string;
  label: string;
  icon: string;
  phase2?: boolean;
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: "⬡" },
  { to: "/events", label: "Events", icon: "◎" },
  { to: "/wells", label: "Wells", icon: "◆", phase2: true },
  { to: "/frac", label: "Frac Jobs", icon: "▣", phase2: true },
  { to: "/stations", label: "Stations", icon: "▲", phase2: true },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-[240px] flex-col border-r border-[var(--color-border)] bg-[var(--color-card)] shadow-lg z-30">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-[var(--color-border)]/50">
        <span className="font-display text-sm font-black uppercase tracking-[.15em] text-[var(--color-fg)]">
          Seismic PoC
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <ul className="space-y-1">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200",
                    isActive
                      ? "bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-fg)]/5 hover:text-[var(--color-fg)]",
                  )
                }
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span className="flex-1 tracking-tight">{item.label}</span>
                {item.phase2 && (
                  <span className="rounded-full bg-[var(--color-fg)]/5 px-2 py-0.5 font-mono text-[9px] font-medium opacity-50">
                    P2
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 border-t border-[var(--color-border)]/50">
        <div className="rounded-xl bg-status-running/5 p-4 border border-status-running/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-status-running/80 mb-1">
            Status
          </p>
          <p className="text-[11px] font-medium text-[var(--color-muted)]">
            Phase 1 Engine Active
          </p>
        </div>
      </div>
    </aside>
  );
}
