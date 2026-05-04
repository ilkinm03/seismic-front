import React, { useEffect, useState } from "react";
import { Dot, Pill } from "./ui";

function CoreLogo() {
  return (
    <div className="grid size-8 place-items-center rounded-lg bg-zinc-950 text-white shadow-sm">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12h3l3-8 4 16 3-10 2 2h5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function Topbar({ regionLabel, eventCount }: { regionLabel: string; eventCount: number }) {
  const [ts, setTs] = useState(new Date().toISOString().slice(0, 19));
  useEffect(() => {
    const t = window.setInterval(() => setTs(new Date().toISOString().slice(0, 19)), 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <header className="h-12 shrink-0 border-b border-zinc-200 bg-white px-4">
      <div className="mx-auto flex h-full max-w-[1920px] items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CoreLogo />
          <div className="leading-tight">
            <div className="text-[14px] font-bold tracking-[-0.03em]">CORE Seismic</div>
            <div className="text-[10px] text-zinc-400">Induced Seismicity Platform</div>
          </div>
          <div className="mx-1 h-5 w-px bg-zinc-200" />
          <Pill bg="rgb(244 244 245)" border="rgb(212 212 216)" className="tracking-[0.08em]">
            PoC v3
          </Pill>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex flex-col items-center px-2">
            <div className="text-[9px] font-bold uppercase tracking-[.1em] text-zinc-400">Region</div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-600">
              <Dot on color="#16a34a" />
              {regionLabel}
            </div>
          </div>
          <div className="h-4 w-px bg-zinc-200" />
          <div className="flex flex-col items-center px-2">
            <div className="text-[9px] font-bold uppercase tracking-[.1em] text-zinc-400">Events</div>
            <div className="text-[11px] font-medium text-zinc-600">{eventCount} loaded</div>
          </div>
          <div className="h-4 w-px bg-zinc-200" />
          <div className="flex flex-col items-center px-2">
            <div className="text-[9px] font-bold uppercase tracking-[.1em] text-zinc-400">Data</div>
            <div className="text-[11px] font-medium text-zinc-600">Mock / Demo</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <Dot on color="#16a34a" />
            <span className="text-[11px] text-zinc-400">Engine online</span>
          </div>
          <span className="font-mono text-[11px] text-zinc-300">{ts} UTC</span>
        </div>
      </div>
    </header>
  );
}
