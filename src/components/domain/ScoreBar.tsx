import type { AttributionResult } from "@/types/api";
import { numberFmt } from "@/lib/format";

export function ScoreBar({ result }: { result: AttributionResult }) {
  const total = result.swd_score + result.frac_score;
  const swdPct = total > 0 ? (result.swd_score / total) * 100 : 0;
  const fracPct = total > 0 ? (result.frac_score / total) * 100 : 0;

  return (
    <div className="space-y-3">
      <Bar
        label="SWD"
        score={result.swd_score}
        pct={swdPct}
        color="var(--color-swd)"
      />
      <Bar
        label="FRAC"
        score={result.frac_score}
        pct={fracPct}
        color="var(--color-frac)"
      />
      <div className="text-right font-mono text-[10px] text-[var(--color-muted)]">
        Total weighted score: {numberFmt(total, { decimals: 2 })}
      </div>
    </div>
  );
}

function Bar({ label, score, pct, color }: { label: string; score: number; pct: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="font-semibold tracking-wide" style={{ color }}>
          {label}
        </span>
        <span className="font-mono">
          <span className="text-[var(--color-fg)]">{pct.toFixed(0)}%</span>
          <span className="ml-2 text-[var(--color-muted)]">{numberFmt(score, { decimals: 1 })}</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-border)]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(pct, 1.5)}%`,
            background: `linear-gradient(90deg, ${color}, color-mix(in oklch, ${color} 70%, white))`,
            animation: "score-fill 0.7s ease-out",
          }}
        />
      </div>
    </div>
  );
}
