import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchStockDetails,
  TARGET_STOCKS,
  type HistoricalPrice,
} from "@/lib/api/stocks";
import { StockHistoryChart } from "@/components/stock-history-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChangeBadge } from "@/components/change-badge";

function isValidTicker(symbol: string): boolean {
  return TARGET_STOCKS.some((stock) => stock.symbol === symbol.toUpperCase());
}

function asDisplayText(value: string): string {
  return value && value.trim().length > 0 ? value : "N/A";
}

function getDollarChangeFromClose(close: string, changePercent: string): string {
  const closeValue = Number.parseFloat(close);
  const percent = Number.parseFloat(changePercent);

  if (!Number.isFinite(closeValue) || !Number.isFinite(percent)) {
    return "N/A";
  }

  const ratio = percent / 100;
  if (ratio <= -1) return "N/A";

  const previousClose = closeValue / (1 + ratio);
  const dollarChange = closeValue - previousClose;

  if (!Number.isFinite(dollarChange)) return "N/A";
  return dollarChange.toFixed(2);
}

function HistoricalRows({ history }: { history: HistoricalPrice[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Close</TableHead>
          <TableHead>Volume</TableHead>
          <TableHead>Change $</TableHead>
          <TableHead className="text-right">Change %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map((row) => (
          <TableRow key={row.date}>
            <TableCell>{row.date}</TableCell>
            <TableCell>${row.close}</TableCell>
            <TableCell>{row.volume}</TableCell>
            <TableCell>
              <ChangeBadge value={getDollarChangeFromClose(row.close, row.changePercent)} />
            </TableCell>
            <TableCell className="text-right">
              <ChangeBadge value={row.changePercent} isPercent />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default async function StockDetailsPage({
  params,
}: PageProps<"/stocks/[symbol]">) {
  const { symbol } = await params;
  const normalizedSymbol = symbol.toUpperCase();

  if (!isValidTicker(normalizedSymbol)) {
    notFound();
  }

  const details = await fetchStockDetails(normalizedSymbol);

  if (!details) {
    notFound();
  }

  const { quote, overview, history } = details;

  const infoBlocks = [
    { label: "Symbol", value: overview.symbol },
    { label: "Asset Type", value: overview.assetType },
    { label: "Name", value: overview.name },
    { label: "Exchange", value: overview.exchange },
    { label: "Sector", value: overview.sector },
    { label: "Industry", value: overview.industry },
    { label: "Market Capitalization", value: overview.marketCapitalization },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(0,184,217,0.24),_transparent_42%),radial-gradient(circle_at_90%_10%,_rgba(34,211,238,0.12),_transparent_36%),radial-gradient(circle_at_24%_78%,_rgba(168,85,247,0.16),_transparent_42%),radial-gradient(circle_at_82%_72%,_rgba(74,222,128,0.14),_transparent_40%),linear-gradient(180deg,#06090f_0%,#05070d_100%)] px-6 py-10 md:px-12 lg:px-16">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/noise-and-texture.avif')] bg-repeat opacity-70 mix-blend-overlay"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.16),transparent_48%)]" aria-hidden />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex items-center justify-between rounded-2xl border border-cyan-300/20 bg-[rgba(5,12,30,0.88)] px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="TensorWave logo" width={180} height={34} />
            <h1 className="text-xl font-light tracking-[0.28em] text-violet-300 md:text-2xl">
              STOCKS
            </h1>
          </div>
          <Link
            href="/"
            className="relative overflow-hidden rounded-full border border-cyan-200/60 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cyan-50 transition hover:border-cyan-100 hover:text-white"
          >
            <span
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(165,243,252,0.82),rgba(34,211,238,0.90))]"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-0 bg-[url('/noise-and-texture.avif')] bg-repeat opacity-10 mix-blend-overlay"
              aria-hidden
            />
            <span className="relative z-10">Back to dashboard</span>
          </Link>
        </div>

        <section className="rounded-2xl border border-cyan-300/20 bg-[rgba(5,12,30,0.88)] p-5 md:p-7">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            {overview.logoUrl ? (
              <Image
                src={overview.logoUrl}
                alt={`${overview.name} logo`}
                width={56}
                height={56}
                unoptimized
                className="h-14 w-14 border border-white/15 bg-white object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-muted text-lg font-semibold">
                {normalizedSymbol.slice(0, 1)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-cyan-50 md:text-3xl">{asDisplayText(overview.name)}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{asDisplayText(overview.symbol)} • Last quote: ${quote.price}</span>
                <ChangeBadge value={quote.change} />
                <ChangeBadge value={quote.changePercent} isPercent />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {infoBlocks.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-[rgba(7,16,40,0.82)] p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">{item.label}</p>
                <p className="mt-1 text-sm text-cyan-50">{asDisplayText(item.value)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-[rgba(7,16,40,0.8)] p-4">
            <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">Description</p>
            <p className="text-sm leading-6 text-cyan-50/90">{asDisplayText(overview.description)}</p>
          </div>
          <StockHistoryChart history={history} />
        </section>

        <section className="rounded-2xl border border-cyan-300/20 bg-[rgba(5,12,30,0.88)] p-4 md:p-6">
          <h2 className="mb-3 text-sm uppercase tracking-[0.16em] text-cyan-100/80">
            Historical prices (daily)
          </h2>
          <HistoricalRows history={history} />
        </section>
      </div>
    </main>
  );
}
