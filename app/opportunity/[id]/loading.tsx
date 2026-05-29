import { Navbar } from "@/components/Navbar";

export default function OpportunityDetailLoading() {
  return (
    <main className="min-h-screen bg-[#040814] text-white">
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
        <div className="h-5 w-44 animate-pulse rounded bg-white/10" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="h-5 w-28 animate-pulse rounded bg-cyan-300/15" />
            <div className="mt-5 h-12 max-w-xl animate-pulse rounded bg-white/10" />
            <div className="mt-4 h-5 max-w-sm animate-pulse rounded bg-white/10" />
            <div className="mt-8 space-y-3">
              <div className="h-4 animate-pulse rounded bg-white/10" />
              <div className="h-4 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
            </div>
          </div>
          <div className="h-72 rounded-2xl border border-white/10 bg-white/[0.03]" />
        </div>
      </section>
    </main>
  );
}
