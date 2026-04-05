import Image from "next/image";
import { Suspense } from "react";
import { StocksTable } from "@/components/stocks-table";
import { StocksTableSkeleton } from "@/components/stocks-table-skeleton";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(0,184,217,0.28),_transparent_42%),radial-gradient(circle_at_90%_10%,_rgba(34,211,238,0.14),_transparent_36%),radial-gradient(circle_at_70%_85%,_rgba(6,182,212,0.12),_transparent_38%),radial-gradient(circle_at_24%_78%,_rgba(168,85,247,0.16),_transparent_42%),radial-gradient(circle_at_82%_72%,_rgba(74,222,128,0.14),_transparent_40%),linear-gradient(180deg,#06090f_0%,#05070d_100%)] px-6 py-10 md:px-12 lg:px-16">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/noise-and-texture.avif')] bg-repeat opacity-70 mix-blend-overlay"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.16),transparent_48%)]" aria-hidden />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan-300/20 bg-[rgba(5,12,30,0.88)] px-5 py-4 shadow-[0_0_0_1px_rgba(0,238,255,0.04),0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="TensorWave logo"
              width={180}
              height={34}
              priority
            />
            <h1 className="text-xl font-light tracking-[0.28em] text-violet-300 md:text-2xl">
              STOCKS
            </h1>
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
            
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-300/15 bg-[rgba(0, 0, 0, 0.88)] p-4 shadow-[0_20px_45px_rgba(0,0,0,0.28)] backdrop-blur md:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-sm tracking-[0.16em] text-cyan-100/70">
              Tracked Stocks:
            </p>
            <p className="text-xs text-muted-foreground">
              Click any row for details, chart, and history.
            </p>
          </div>

          <Suspense fallback={<StocksTableSkeleton />}>
            <StocksTable />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
