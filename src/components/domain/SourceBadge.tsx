import { Badge } from "@/components/ui/Badge";

export function SourceBadge({ source }: { source: string | null | undefined }) {
  if (!source) return <Badge tone="neutral">—</Badge>;
  if (source === "texnet") return <Badge tone="brand">TexNet</Badge>;
  if (source === "usgs") return <Badge tone="info">USGS</Badge>;
  return <Badge tone="neutral">{source.toUpperCase()}</Badge>;
}
