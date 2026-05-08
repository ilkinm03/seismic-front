import * as RSlider from "@radix-ui/react-slider";
import { cn } from "@/lib/cn";

export interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function Slider({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  disabled,
  className,
  ariaLabel,
}: SliderProps) {
  return (
    <RSlider.Root
      className={cn(
        "relative flex h-5 w-full select-none items-center",
        className,
      )}
      value={[value]}
      onValueChange={(v) => onValueChange(v[0] ?? 0)}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
    >
      <RSlider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[var(--color-border)]">
        <RSlider.Range className="absolute h-full rounded-full bg-[var(--color-accent)]" />
      </RSlider.Track>
      <RSlider.Thumb
        aria-label={ariaLabel}
        className="block size-4 rounded-full border-2 border-[var(--color-card)] bg-[var(--color-accent)] shadow-[0_2px_6px_rgba(0,0,0,.18)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50"
      />
    </RSlider.Root>
  );
}
