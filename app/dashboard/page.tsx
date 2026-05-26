import { DashboardOpportunityManager } from "@/components/DashboardOpportunityManager";
import { LogoutButton } from "@/components/LogoutButton";
import { Navbar } from "@/components/Navbar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <Navbar />
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Dashboard</p>
            <h1 className="mt-2 text-4xl font-black tracking-normal sm:text-5xl">Opportunity activity</h1>
          </div>
          <LogoutButton />
        </div>

        <DashboardOpportunityManager />
      </section>
    </main>
  );
}
