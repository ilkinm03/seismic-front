import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/queries/keys";
import { syncService } from "@/services/sync";
import type {
  FracTriggerResponse,
  SyncFetchSummary,
  SyncSource,
} from "@/types/api";

const SOURCE_LABEL: Record<SyncSource, string> = {
  fracfocus: "FracFocus",
  uic: "SWD Wells (UIC)",
  h10: "SWD Monitor (H-10)",
  texnet: "TexNet",
  usgs: "USGS",
  iris: "IRIS Stations",
};

function summarize(label: string, summary: SyncFetchSummary): string {
  if (summary.status !== "success") return `${label} failed: ${summary.error ?? "unknown"}`;
  const parts: string[] = [];
  if (typeof summary.inserted === "number") parts.push(`${summary.inserted} inserted`);
  if (typeof summary.updated === "number") parts.push(`${summary.updated} updated`);
  return `${label}: ${parts.join(", ") || "ok"}`;
}

function invalidateSync(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: qk.sync.all() });
}

export function useTriggerFracFocus() {
  const qc = useQueryClient();
  return useMutation<FracTriggerResponse, Error, void>({
    mutationFn: () => syncService.triggerFracFocus(),
    onSuccess: (res) => {
      if (res.status === "already_running") toast.warning("FracFocus sync zaten çalışıyor.");
      else toast.success("FracFocus sync started in background.");
      invalidateSync(qc);
    },
  });
}

export function useTriggerTexNet() {
  const qc = useQueryClient();
  return useMutation<SyncFetchSummary, Error, number | undefined>({
    mutationFn: (minMag) => syncService.triggerTexNet(minMag),
    onSuccess: (res) => {
      toast.success(summarize(SOURCE_LABEL.texnet, res));
      invalidateSync(qc);
      qc.invalidateQueries({ queryKey: qk.events.all() });
    },
  });
}

export function useTriggerUSGS() {
  const qc = useQueryClient();
  return useMutation<SyncFetchSummary, Error, number | undefined>({
    mutationFn: (minMag) => syncService.triggerUSGS(minMag),
    onSuccess: (res) => {
      toast.success(summarize(SOURCE_LABEL.usgs, res));
      invalidateSync(qc);
      qc.invalidateQueries({ queryKey: qk.events.all() });
    },
  });
}

export function useTriggerIRIS() {
  const qc = useQueryClient();
  return useMutation<SyncFetchSummary, Error, void>({
    mutationFn: () => syncService.triggerIRIS(),
    onSuccess: (res) => {
      toast.success(summarize(SOURCE_LABEL.iris, res));
      invalidateSync(qc);
      qc.invalidateQueries({ queryKey: qk.stations.all() });
    },
  });
}

export function useTriggerUIC() {
  const qc = useQueryClient();
  return useMutation<SyncFetchSummary, Error, void>({
    mutationFn: () => syncService.triggerUIC(),
    onSuccess: (res) => {
      toast.success(summarize(SOURCE_LABEL.uic, res));
      invalidateSync(qc);
      qc.invalidateQueries({ queryKey: qk.wells.all() });
    },
  });
}

export function useTriggerH10() {
  const qc = useQueryClient();
  return useMutation<SyncFetchSummary, Error, void>({
    mutationFn: () => syncService.triggerH10(),
    onSuccess: (res) => {
      toast.success(summarize(SOURCE_LABEL.h10, res));
      invalidateSync(qc);
      qc.invalidateQueries({ queryKey: qk.wells.all() });
    },
  });
}
