import { Navbar } from "@/components/Navbar";
import { OpportunityForm } from "@/components/OpportunityForm";

export default function AddOpportunityPage() {
  return (
    <main className="min-h-screen bg-[#040814] text-white">
      <Navbar />
      <section className="mx-auto grid w-full max-w-7xl min-w-0 gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Add opportunity</p>
          <h1 className="mt-2 break-words text-4xl font-black tracking-normal text-white sm:text-5xl">Share a build-worthy opening.</h1>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Add a high-signal track for students who are ready to build proof of work.
          </p>
        </div>
        <OpportunityForm />
      </section>
    </main>
  );
}
