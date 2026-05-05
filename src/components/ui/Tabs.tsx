import * as RTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <RTabs.Root value={value} onValueChange={onValueChange} className={cn("flex flex-col gap-3", className)}>
      {children}
    </RTabs.Root>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <RTabs.List
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-elevated)] p-1",
        className,
      )}
    >
      {children}
    </RTabs.List>
  );
}

export function TabsTrigger({
  value,
  children,
  count,
}: {
  value: string;
  children: ReactNode;
  count?: number | null;
}) {
  return (
    <RTabs.Trigger
      value={value}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium tracking-tight text-[var(--color-muted)]",
        "transition-colors hover:text-[var(--color-fg)]",
        "data-[state=active]:bg-[var(--color-card)] data-[state=active]:text-[var(--color-fg)] data-[state=active]:shadow-[var(--shadow-soft)]",
      )}
    >
      {children}
      {typeof count === "number" ? (
        <span className="rounded-full bg-[var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-muted)]">
          {count}
        </span>
      ) : null}
    </RTabs.Trigger>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <RTabs.Content value={value} className={cn("focus-visible:outline-none", className)}>
      {children}
    </RTabs.Content>
  );
}
