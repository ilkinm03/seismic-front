import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  useTriggerFracFocus,
  useTriggerH10,
  useTriggerIRIS,
  useTriggerTexNet,
  useTriggerUIC,
  useTriggerUSGS,
} from "@/queries/useTriggerSync";
import type { SyncRun, SyncSource } from "@/types/api";

interface ActionRow {
  source: SyncSource;
  label: string;
  hint: string;
  isPending: boolean;
  run: () => void;
  icon: React.ReactNode;
  accent: string;
}

export function TriggerPanel({ recentRuns }: { recentRuns: SyncRun[] }) {
  const fracFocus = useTriggerFracFocus();
  const texnet = useTriggerTexNet();
  const usgs = useTriggerUSGS();
  const iris = useTriggerIRIS();
  const uic = useTriggerUIC();
  const h10 = useTriggerH10();

  const isRunning = (source: SyncSource): boolean =>
    recentRuns.some(
      (r) => r.source === source && (r.status === "running" || r.status === "pending"),
    );

  const rows: ActionRow[] = [
    {
      source: "texnet",
      label: "TexNet",
      hint: "Seismic events (M ≥ 2.5)",
      isPending: texnet.isPending,
      run: () => texnet.mutate(2.5),
      icon: <path d="M2 13.5l2-1 2 2 3-8 2 10 3-6 2 2 2-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
      accent: "var(--color-accent)",
    },
    {
      source: "usgs",
      label: "USGS",
      hint: "Historical catalog",
      isPending: usgs.isPending,
      run: () => usgs.mutate(1.5),
      icon: <><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M2 10h16M10 2a15 15 0 000 16 15 15 0 000-16" stroke="currentColor" strokeWidth="1.5" fill="none" /></>,
      accent: "var(--color-status-running)",
    },
    {
      source: "iris",
      label: "IRIS Stations",
      hint: "Network metadata",
      isPending: iris.isPending,
      run: () => iris.mutate(),
      icon: <path d="M10 3l-7 12h14l-7-12zM10 18v-3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />,
      accent: "var(--color-station)",
    },
    {
      source: "uic",
      label: "SWD Wells",
      hint: "UIC inventory load",
      isPending: uic.isPending,
      run: () => uic.mutate(),
      icon: <><path d="M7 3l3 14 3-14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M5 20h10" stroke="currentColor" strokeWidth="2" /></>,
      accent: "var(--color-swd)",
    },
    {
      source: "h10",
      label: "SWD Monitor",
      hint: "Monthly injection",
      isPending: h10.isPending,
      run: () => h10.mutate(),
      icon: <><rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M7 12l2-2 3 3 2-2" stroke="currentColor" strokeWidth="1.5" fill="none" /></>,
      accent: "var(--color-swd)",
    },
    {
      source: "fracfocus",
      label: "FracFocus",
      hint: "Hydraulic disclosures",
      isPending: fracFocus.isPending,
      run: () => fracFocus.mutate(),
      icon: <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" stroke="currentColor" strokeWidth="2" fill="none" />,
      accent: "var(--color-frac)",
    },
  ];

  return (
    <Card className="h-full border-[var(--color-border)]/40 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader
        title="Data Ingestion"
        subtitle="Manually trigger backend pipelines"
      />
      <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map((row) => {
          const running = isRunning(row.source);
          const disabled = running || row.isPending;
          return (
            <div
              key={row.source}
              className="group relative flex flex-col gap-2.5 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-card-elevated)] p-3 transition-all hover:border-[var(--color-accent)]/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-card)] transition-transform group-hover:scale-105 shadow-sm"
                  style={{ color: row.accent }}
                >
                  <svg viewBox="0 0 20 20" className="h-5 w-5">
                    {row.icon}
                  </svg>
                </div>
                <Button
                  size="sm"
                  variant={running ? "subtle" : "primary"}
                  loading={row.isPending}
                  disabled={disabled}
                  onClick={row.run}
                  className="h-7 rounded-lg px-3 text-[9px] font-black uppercase tracking-widest"
                >
                  {running ? "Running" : "Trigger"}
                </Button>
              </div>
              
              <div className="min-w-0">
                <div className="text-xs font-black tracking-tight text-[var(--color-fg)] leading-none">{row.label}</div>
                <div className="mt-1 truncate text-[10px] font-medium text-[var(--color-muted)]">
                  {row.hint}
                </div>
              </div>
              
              {/* Subtle background accent glow */}
              <div 
                className="absolute inset-0 -z-10 rounded-xl opacity-0 blur-xl transition-opacity group-hover:opacity-[0.05]"
                style={{ backgroundColor: row.accent }}
              />
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
