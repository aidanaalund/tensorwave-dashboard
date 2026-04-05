"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, AreaChart, Tracker, type Color } from "@tremor/react";
import type { HistoricalPrice } from "@/lib/api/stocks";

type ChartPoint = {
  date: string;
  close: number;
};

const CHART_Y_AXIS_WIDTH = 72;
const CHART_LEFT_PADDING = 20;
const CHART_RIGHT_PADDING = 20;
const TRACKER_LEFT_NUDGE = 18;

type TrackerBlock = {
  color: Color;
  tooltip: string;
};

function formatAxisDateLabel(dateString: string): string {
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;

  const month = Number.parseInt(parts[1], 10);
  const day = Number.parseInt(parts[2], 10);

  if (!Number.isFinite(month) || !Number.isFinite(day)) {
    return dateString;
  }

  return `${month}/${day}`;
}

function getAreaColorClasses(color: Color): string {
  switch (color) {
    case "lime":
      return "[&_.recharts-area-curve]:[stroke:rgb(163,230,53)] [&_.recharts-area-area]:[fill:rgba(163,230,53,0.24)] [&_.recharts-dot]:[fill:rgb(163,230,53)] [&_.recharts-dot]:[stroke:rgb(163,230,53)]";
    case "sky":
      return "[&_.recharts-area-curve]:[stroke:rgb(56,189,248)] [&_.recharts-area-area]:[fill:rgba(56,189,248,0.24)] [&_.recharts-dot]:[fill:rgb(125,211,252)] [&_.recharts-dot]:[stroke:rgb(125,211,252)]";
    case "cyan":
      return "[&_.recharts-area-curve]:[stroke:rgb(34,211,238)] [&_.recharts-area-area]:[fill:rgba(34,211,238,0.24)] [&_.recharts-dot]:[fill:rgb(103,232,249)] [&_.recharts-dot]:[stroke:rgb(103,232,249)]";
    case "amber":
      return "[&_.recharts-area-curve]:[stroke:rgb(251,191,36)] [&_.recharts-area-area]:[fill:rgba(251,191,36,0.24)] [&_.recharts-dot]:[fill:rgb(252,211,77)] [&_.recharts-dot]:[stroke:rgb(252,211,77)]";
    case "rose":
      return "[&_.recharts-area-curve]:[stroke:rgb(251,113,133)] [&_.recharts-area-area]:[fill:rgba(251,113,133,0.22)] [&_.recharts-dot]:[fill:rgb(253,164,175)] [&_.recharts-dot]:[stroke:rgb(253,164,175)]";
    default:
      return "[&_.recharts-area-curve]:[stroke:rgb(34,211,238)] [&_.recharts-area-area]:[fill:rgba(34,211,238,0.24)] [&_.recharts-dot]:[fill:rgb(103,232,249)] [&_.recharts-dot]:[stroke:rgb(103,232,249)]";
  }
}

function currencyFormatter(value: number): string {
  return `$${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value)}`;
}

function buildChartData(history: HistoricalPrice[]): ChartPoint[] {
  return [...history]
    .slice(0, 20)
    .reverse()
    .map((item) => ({
      date: formatAxisDateLabel(item.date),
      close: Number.parseFloat(item.close),
    }))
    .filter((item) => Number.isFinite(item.close));
}

function buildTrackerData(chartData: ChartPoint[]): TrackerBlock[] {
  if (chartData.length < 2) {
    return [];
  }

  return chartData.slice(1).map((point, index) => {
    const previous = chartData[index];

    if (!previous || !Number.isFinite(previous.close) || !Number.isFinite(point.close) || previous.close <= 0) {
      return {
        color: "slate",
        tooltip: `${point.date} • No data`,
      };
    }

    const delta = point.close - previous.close;
    const changePercent = (delta / previous.close) * 100;
    const isGain = delta >= 0;

    return {
      color: isGain ? "lime" : "rose",
      tooltip: `${previous.date} -> ${point.date} • ${isGain ? "+" : ""}${changePercent.toFixed(2)}%`,
    };
  });
}

export function StockHistoryChart({ history }: { history: HistoricalPrice[] }) {
  const [isReady, setIsReady] = useState(false);
  const data = useMemo(() => buildChartData(history), [history]);
  const trackerData = useMemo(() => buildTrackerData(data), [data]);
  const firstClose = data[0]?.close;
  const lastClose = data[data.length - 1]?.close;
  const chartColor: Color =
    Number.isFinite(firstClose) && Number.isFinite(lastClose) && lastClose < firstClose
      ? "rose"
      : "lime";
  const chartColors: Color[] = [chartColor];
  const chartColorClasses = getAreaColorClasses(chartColor);
  const trackerInsetStyle = {
    paddingLeft: `${CHART_Y_AXIS_WIDTH + CHART_LEFT_PADDING + TRACKER_LEFT_NUDGE}px`,
    paddingRight: `${CHART_RIGHT_PADDING}px`,
  };
  const overlayPlotInsetStyle = {
    left: `${CHART_Y_AXIS_WIDTH + CHART_LEFT_PADDING}px`,
    right: `${CHART_RIGHT_PADDING}px`,
    top: "5px",
    bottom: "26px",
  };

  useEffect(() => {
    const id = window.setTimeout(() => setIsReady(true), 450);
    return () => window.clearTimeout(id);
  }, []);

  if (!isReady) {
    return <StockHistoryChartSkeleton />;
  }

  return (
    <Card className="border-cyan-300/20 bg-[rgba(5,12,30,0.88)]">
      <p className="mb-3 text-sm uppercase tracking-[0.18em] text-cyan-200/70">
        Close price trend (1M)
      </p>
      <div className="relative isolate overflow-hidden rounded-xl bg-[rgba(7,16,40,0.82)]">
        <AreaChart
          className={`h-64 text-slate-100 [&_.recharts-cartesian-axis-tick-value]:fill-slate-100 [&_.recharts-cartesian-axis-line]:stroke-white/20 [&_.recharts-cartesian-grid-horizontal_line]:stroke-white/10 ${chartColorClasses}`}
          data={data}
          index="date"
          categories={["close"]}
          showLegend={false}
          valueFormatter={currencyFormatter}
          colors={chartColors}
          showGridLines={true}
          yAxisWidth={72}
          yAxisLabel={"Closing Price ($ USD)"}
          showAnimation
        />
        <div
          className="pointer-events-none absolute z-10 opacity-20 mix-blend-soft-light"
          style={{
            ...overlayPlotInsetStyle,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.28) 0.8px, transparent 0.8px)",
            backgroundSize: "3px 4px",
          }}
        />
        <div
          className="pointer-events-none absolute z-10 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_3px)] opacity-20 mix-blend-overlay"
          style={overlayPlotInsetStyle}
        />
        <div
          className="pointer-events-none absolute z-20 border-r border-dashed border-cyan-200/70"
          style={{
            right: `${CHART_RIGHT_PADDING}px`,
            top: "5px",
            bottom: "26px",
          }}
        />
        {Number.isFinite(lastClose) && (
          <div
            className="pointer-events-none absolute right-5 top-2 z-20 rounded border border-cyan-200/50 bg-black/55 px-1.5 py-0.5 text-[11px] text-cyan-100"
          >
            ${lastClose.toFixed(2)}
          </div>
        )}
      </div>
      <div className="hidden bg-lime-500 bg-rose-500 bg-slate-500 dark:bg-lime-500 dark:bg-rose-500 dark:bg-slate-500" />
      <div
        className="mt-1.5 h-2 [&_[role=tooltip]]:translate-y-12 [&_[role=tooltip]]:z-30"
        style={trackerInsetStyle}
      >
        <Tracker data={trackerData} className="h-2" />
      </div>
    </Card>
  );
}

export function StockHistoryChartSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-300/20 bg-[rgba(5,12,30,0.88)] p-5">
      <div className="mb-4 h-4 w-48 animate-pulse rounded bg-cyan-100/15" />
      <div className="relative h-64 rounded-xl bg-[rgba(7,16,40,0.82)]">
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.12)_40%,transparent_60%)] [background-size:200%_100%]" />
      </div>
    </div>
  );
}
