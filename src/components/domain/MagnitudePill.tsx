import { magnitudeMeta } from "@/lib/seismic";
import { cn } from "@/lib/cn";

export function MagnitudePill({
  magnitude,
  magType,
}: {
  magnitude: number | null | undefined;
  magType?: string | null;
}) {
  const meta = magnitudeMeta(magnitude);
  const value = magnitude == null ? "—" : magnitude.toFixed(1);

  return (
    <div
      className={cn(
        "flex h-10 w-14 flex-col items-center justify-center rounded-xl border font-mono shadow-sm transition-transform active:scale-95",
      )}
      style={{
        color: meta.color,
        backgroundColor: meta.bg,
        borderColor: meta.border,
      }}
    >
      <div className="text-sm font-black leading-none">M{value}</div>
      {magType && (
        <div className="mt-0.5 text-[8px] font-bold uppercase opacity-60">
          {magType}
        </div>
      )}
    </div>
  );
}
