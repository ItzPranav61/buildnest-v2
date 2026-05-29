import { DashboardOpportunityManager } from "@/components/DashboardOpportunityManager";
import { LogoutButton } from "@/components/LogoutButton";
import { Navbar } from "@/components/Navbar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#040814] text-white">
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Dashboard</p>
            <h1 className="mt-2 break-words text-4xl font-black tracking-normal text-white sm:text-5xl">Opportunity activity</h1>
          </div>
          <LogoutButton />
        </div>

        <DashboardOpportunityManager />
      </section>
    </main>
  );
}
