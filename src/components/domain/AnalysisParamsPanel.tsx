import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { DEFAULT_ANALYSIS_PARAMS, type AnalysisParams } from "@/types/api";
import { humanDays } from "@/lib/format";

export interface AnalysisParamsPanelProps {
  value: AnalysisParams;
  onChange: (next: AnalysisParams) => void;
  onPreview: () => void;
  onAnalyze: () => void;
  previewing?: boolean;
  analyzing?: boolean;
  disabled?: boolean;
}

interface SliderRow {
  key: keyof AnalysisParams;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  hint?: (v: number) => string;
}

const ROWS: SliderRow[] = [
  {
    key: "swd_radius_km",
    label: "SWD Search Radius",
    min: 1,
    max: 200,
    step: 1,
    unit: "km",
  },
  {
    key: "swd_window_days",
    label: "SWD Lookback",
    min: 30,
    max: 18250,
    step: 30,
    unit: "gün",
    hint: humanDays,
  },
  {
    key: "frac_radius_km",
    label: "Frac Search Radius",
    min: 1,
    max: 200,
    step: 1,
    unit: "km",
  },
  {
    key: "frac_window_days",
    label: "Frac Lookback",
    min: 30,
    max: 18250,
    step: 30,
    unit: "gün",
    hint: humanDays,
  },
  {
    key: "station_radius_km",
    label: "Station Search Radius",
    min: 5,
    max: 500,
    step: 5,
    unit: "km",
  },
];

export function AnalysisParamsPanel({
  value,
  onChange,
  onPreview,
  onAnalyze,
  previewing,
  analyzing,
  disabled,
}: AnalysisParamsPanelProps) {
  const set = (key: keyof AnalysisParams, v: number) =>
    onChange({ ...value, [key]: v });

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Analiz Parametreleri"
        subtitle="Mesafe ve zaman pencereleri"
        actions={
          <Tooltip content="FRONTEND_GUIDE §5.4 default değerleri">
            <button
              type="button"
              onClick={() => onChange({ ...DEFAULT_ANALYSIS_PARAMS })}
              className="rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-[var(--color-muted)] hover:bg-[var(--color-card-elevated)] hover:text-[var(--color-fg)]"
            >
              Reset
            </button>
          </Tooltip>
        }
      />
      <CardBody className="space-y-5">
        {ROWS.map((row) => {
          const v = value[row.key];
          return (
            <div key={row.key}>
              <div className="mb-2 flex items-end justify-between gap-2">
                <span className="text-xs font-medium text-[var(--color-fg)]">
                  {row.label}
                </span>
                <span className="font-mono text-xs text-[var(--color-fg)]">
                  {v}{" "}
                  <span className="text-[var(--color-muted)]">{row.unit}</span>
                  {row.hint ? (
                    <span className="ml-1 text-[10px] text-[var(--color-subtle)]">
                      {row.hint(v)}
                    </span>
                  ) : null}
                </span>
              </div>
              <Slider
                value={v}
                onValueChange={(nv) => set(row.key, nv)}
                min={row.min}
                max={row.max}
                step={row.step}
                ariaLabel={row.label}
              />
            </div>
          );
        })}

        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={onPreview}
            loading={previewing}
            disabled={disabled || analyzing}
            variant="outline"
            fullWidth
          >
            Preview Context
          </Button>
          <Button
            onClick={onAnalyze}
            loading={analyzing}
            disabled={disabled || previewing}
            variant="primary"
            fullWidth
          >
            Run Analysis
          </Button>
          <p className="text-center text-[10px] text-[var(--color-subtle)]">
            Preview = sadece harita ve tablolar · Analiz = atıf motoru çalışır
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
