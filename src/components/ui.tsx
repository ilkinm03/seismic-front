import React from "react";

export function Dot({ on = true, color = "#a1a1aa" }: { on?: boolean; color?: string }) {
  return (
    <span
      className="inline-block size-1.5 shrink-0 rounded-full"
      style={{
        background: on ? color : "rgb(212 212 216)",
        boxShadow: on ? `0 0 0 2px ${color}28` : "none",
      }}
    />
  );
}

export function Pill({
  children,
  color,
  bg,
  border,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  border?: string;
  className?: string;
}) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-700 " +
        className
      }
      style={{ color, background: bg, borderColor: border }}
    >
      {children}
    </span>
  );
}

export function Sep() {
  return <div className="h-px w-full bg-zinc-200" />;
}

export function Spinner({ size = 14 }: { size?: number }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border border-zinc-300 border-t-zinc-600"
      style={{ width: size, height: size }}
    />
  );
}

