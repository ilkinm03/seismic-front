import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

export function Table({
  className,
  ...rest
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn("w-full border-collapse text-sm tabular", className)}
      {...rest}
    />
  );
}

export function THead({
  className,
  ...rest
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("text-left", className)} {...rest} />;
}

export function TBody({
  className,
  ...rest
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn(className)} {...rest} />;
}

export const TR = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(function TR({ className, ...rest }, ref) {
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-card-elevated)]/60",
        className,
      )}
      {...rest}
    />
  );
});

export function TH({
  className,
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "sticky top-0 z-[1] border-b border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[.08em] text-[var(--color-muted)]",
        className,
      )}
      {...rest}
    />
  );
}

export function TD({
  className,
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("px-3 py-2 align-middle text-[var(--color-fg)]", className)}
      {...rest}
    />
  );
}
