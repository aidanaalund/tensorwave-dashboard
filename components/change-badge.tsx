"use client";

import { Badge } from "@tremor/react";

type ChangeBadgeProps = {
  value: string;
  isPercent?: boolean;
};

function getBadgeClassName(value: string): string {
  const parsed = Number.parseFloat(value);

  if (!Number.isFinite(parsed)) {
    return "border border-slate-500/45 bg-slate-500/15 px-2 py-0.5 text-xs font-medium text-slate-200";
  }

  if (parsed > 0) {
    return "border border-green-500/50 bg-lime-500/15 px-2 py-0.5 text-xs font-medium text-lime-300";
  }

  if (parsed < 0) {
    return "border border-rose-500/55 bg-rose-500/15 px-2 py-0.5 text-xs font-medium text-rose-300";
  }

  return "border border-slate-500/45 bg-slate-500/15 px-2 py-0.5 text-xs font-medium text-slate-200";
}

function formatBadgeValue(value: string, isPercent: boolean): string {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return "N/A";

  const hasSign = parsed > 0 ? "+" : "";
  const formatted = Number.isFinite(parsed) ? parsed.toFixed(2) : value;
  return isPercent ? `${hasSign}${formatted}%` : `${hasSign}$${formatted}`;
}

export function ChangeBadge({ value, isPercent = false }: ChangeBadgeProps) {
  return (
    <Badge className={getBadgeClassName(value)}>
      {formatBadgeValue(value, isPercent)}
    </Badge>
  );
}
