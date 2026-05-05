import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Skeleton({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-[pulse-soft_1.4s_ease-in-out_infinite] rounded-md bg-[var(--color-border)]",
        className,
      )}
      {...rest}
    />
  );
}
