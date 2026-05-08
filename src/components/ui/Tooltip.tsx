import * as RTooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <RTooltip.Provider delayDuration={150}>{children}</RTooltip.Provider>;
}

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: TooltipProps) {
  return (
    <RTooltip.Root>
      <RTooltip.Trigger asChild>
        <span className="cursor-default">{children}</span>
      </RTooltip.Trigger>
      <RTooltip.Portal>
        <RTooltip.Content
          side={side}
          sideOffset={6}
          className={cn(
            "z-[1000] max-w-[280px] rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 py-1.5 text-xs text-[var(--color-fg)] shadow-[var(--shadow-pop)]",
            "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=delayed-open]:fade-in",
            className,
          )}
        >
          {content}
          <RTooltip.Arrow className="fill-[var(--color-card)]" />
        </RTooltip.Content>
      </RTooltip.Portal>
    </RTooltip.Root>
  );
}
