import * as RSwitch from "@radix-ui/react-switch";
import { cn } from "@/lib/cn";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  ariaLabel,
  className,
}: SwitchProps) {
  return (
    <RSwitch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-[var(--color-border-strong)]",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
        "data-[state=checked]:bg-[var(--color-accent)] data-[state=unchecked]:bg-[var(--color-card-elevated)]",
        "disabled:opacity-50",
        className,
      )}
    >
      <RSwitch.Thumb
        className={cn(
          "block size-3.5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform",
          "data-[state=checked]:translate-x-[1.125rem]",
        )}
      />
    </RSwitch.Root>
  );
}
