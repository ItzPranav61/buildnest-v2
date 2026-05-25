import { Navbar } from "@/components/Navbar";
import { OpportunityForm } from "@/components/OpportunityForm";

export default function AddOpportunityPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <Navbar />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Add opportunity</p>
          <h1 className="mt-2 text-4xl font-black tracking-normal sm:text-5xl">Share a build-worthy opening.</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Submit a new opportunity to the live Supabase listings.
          </p>
        </div>
        <OpportunityForm />
      </section>
    </main>
  );
}
