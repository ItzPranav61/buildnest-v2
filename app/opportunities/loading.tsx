import { Navbar } from "@/components/Navbar";

export default function OpportunitiesLoading() {
  return (
    <main className="min-h-screen bg-[#040814] text-white">
      <Navbar />
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Opportunities</p>
        <h1 className="mt-2 text-4xl font-black tracking-normal text-white sm:text-5xl">Browse student-ready work</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="h-72 rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl shadow-black/10 backdrop-blur" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl shadow-black/10 backdrop-blur" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
