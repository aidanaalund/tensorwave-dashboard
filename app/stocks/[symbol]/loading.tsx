export default function LoadingStockDetails() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(0,184,217,0.16),_transparent_40%),radial-gradient(circle_at_90%_10%,_rgba(255,255,255,0.06),_transparent_30%),linear-gradient(180deg,#06090f_0%,#05070d_100%)] px-6 py-10 md:px-12 lg:px-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="h-18 animate-pulse rounded-2xl border border-cyan-300/20 bg-card/70" />

        <section className="rounded-2xl border border-cyan-300/20 bg-card/70 p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-14 w-14 animate-pulse rounded-full bg-cyan-100/15" />
            <div className="space-y-2">
              <div className="h-6 w-56 animate-pulse rounded bg-cyan-100/15" />
              <div className="h-4 w-40 animate-pulse rounded bg-cyan-100/15" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-xl bg-cyan-100/10" />
            ))}
          </div>
          <div className="mt-5 h-24 animate-pulse rounded-xl bg-cyan-100/10" />
        </section>

        <section className="rounded-2xl border border-cyan-300/20 bg-card/70 p-5">
          <div className="mb-4 h-4 w-48 animate-pulse rounded bg-cyan-100/15" />
          <div className="h-64 animate-pulse rounded-xl bg-cyan-100/10" />
        </section>

        <section className="rounded-2xl border border-cyan-300/20 bg-card/70 p-4 md:p-6">
          <div className="mb-4 h-4 w-52 animate-pulse rounded bg-cyan-100/15" />
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="mb-2 h-10 animate-pulse rounded bg-cyan-100/10" />
          ))}
        </section>
      </div>
    </main>
  );
}
