"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { StockData } from "@/lib/api/stocks";
import Image from "next/image";
import { ChangeBadge } from "@/components/change-badge";
import { type Color } from "@tremor/react";
import { ResponsiveContainer, BarChart, Bar, Cell, YAxis } from "recharts";

type PreviewPoint = {
  step: string;
  move: number;
};

function buildPreviewData(stock: StockData): PreviewPoint[] {
  const basePrice = Number.parseFloat(stock.price);
  const changeValue = Number.parseFloat(stock.change);
  const symbolSeed = Array.from(stock.symbol).reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const safeBase = Number.isFinite(basePrice) ? basePrice : 100;
  const drift = Number.isFinite(changeValue) ? changeValue : 0;

  const generatedFallback = Array.from({ length: 12 }, (_, index) => {
    const wave = Math.sin((index + symbolSeed) * 0.9) * (safeBase * 0.008);
    const trend = (index - 5.5) * drift * 0.065;
    const price = Math.max(1, safeBase + wave + trend);

    return Number(price.toFixed(2));
  });

  const rawSeries = stock.sparklineCloses?.length ? stock.sparklineCloses : generatedFallback;
  const generated = rawSeries.slice(-12);

  return generated.map((price, index) => {
    const previous = index > 0 ? generated[index - 1] : price;
    const deltaPercent = previous > 0 ? ((price - previous) / previous) * 100 : 0;

    return {
      step: String(index),
      move: Number(deltaPercent.toFixed(3)),
    };
  });
}

function getMaxAbsMove(data: PreviewPoint[]): number {
  const maxAbs = data.reduce((max, point) => Math.max(max, Math.abs(point.move)), 0);
  return maxAbs > 0 ? maxAbs : 0.5;
}

export function StockRow({ stock }: { stock: StockData }) {
  const router = useRouter();
  const previewData = buildPreviewData(stock);
  const maxAbsMove = getMaxAbsMove(previewData);
  const gainColor: Color = "emerald";
  const lossColor: Color = "rose";
  const colorToFill: Partial<Record<Color, string>> = {
    emerald: "#34d399eb",
    rose: "rgba(251, 113, 133, 0.92)",
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => router.push(`/stocks/${stock.symbol}`)}
    >
      <TableCell className="border-r border-white/10">
        {stock.logoUrl ? (
          <Image
            src={stock.logoUrl}
            alt={`${stock.name} logo`}
            width={28}
            height={28}
            unoptimized
            className="h-7 w-7 border border-white/10 bg-white object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-muted text-[10px] text-muted-foreground">
            {stock.symbol.slice(0, 1)}
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium">{stock.symbol}</TableCell>
      <TableCell>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>{stock.name}</span>
            {stock.isDelayed && (
              <span className="rounded border border-amber-300/30 bg-amber-300/15 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-amber-100/90">
                Delayed
              </span>
            )}
          </div>
          <div className="h-8 w-[48px] rounded bg-background/30 p-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={previewData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <YAxis hide domain={[-maxAbsMove, maxAbsMove]} />
                <Bar dataKey="move" barSize={2} minPointSize={1}>
                  {previewData.map((point) => (
                    <Cell
                      key={point.step}
                      fill={
                        point.move >= 0
                          ? (colorToFill[gainColor] ?? "rgba(148, 163, 184, 0.92)")
                          : (colorToFill[lossColor] ?? "rgba(148, 163, 184, 0.92)")
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </TableCell>
      <TableCell>{stock.price === "N/A" ? "N/A" : `$${stock.price}`}</TableCell>
      <TableCell>
        <ChangeBadge value={stock.change} />
      </TableCell>
      <TableCell>
        <ChangeBadge value={stock.changePercent} isPercent />
      </TableCell>
      <TableCell>{stock.volume}</TableCell>
      <TableCell>{stock.marketCap}</TableCell>
      <TableCell className="text-right">{stock.exchange}</TableCell>
    </TableRow>
  );
}