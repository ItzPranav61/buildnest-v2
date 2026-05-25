import { Navbar } from "@/components/Navbar";

export default function OpportunitiesLoading() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <Navbar />
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Opportunities</p>
        <h1 className="mt-2 text-4xl font-black tracking-normal sm:text-5xl">Browse student-ready work</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="h-72 rounded-lg border border-slate-200 bg-white shadow-sm" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-64 animate-pulse rounded-lg border border-slate-200 bg-white shadow-sm" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
