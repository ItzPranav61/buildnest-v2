import { FiBriefcase, FiClock, FiEye, FiUsers } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { OpportunityCard } from "@/components/OpportunityCard";
import type { Opportunity } from "@/types/opportunity";

const recentOpportunities: Opportunity[] = [
  {
    title: "No-Code Automation Sprint",
    organization: "OpsLab",
    category: "Project",
    status: "Open",
    description: "Build useful internal automations and present before a mentor panel.",
    location: "Remote",
    tags: ["Zapier", "Airtable", "Ops"],
    deadline: "Jun 18"
  }
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <Navbar />
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Dashboard</p>
          <h1 className="mt-2 text-4xl font-black tracking-normal sm:text-5xl">Opportunity activity</h1>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Published", value: "12", icon: FiBriefcase },
            { label: "Applications", value: "186", icon: FiUsers },
            { label: "Views", value: "3.8k", icon: FiEye },
            { label: "Closing soon", value: "5", icon: FiClock }
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">{item.label}</span>
                <span className="grid size-10 place-items-center rounded-lg bg-cyan-100 text-cyan-800">
                  <item.icon aria-hidden />
                </span>
              </div>
              <p className="mt-4 text-3xl font-black">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Weekly snapshot</h2>
            <div className="mt-5 space-y-4">
              {["Design fellowship saved by 24 students", "Three new hackathons added", "Remote internships are trending"].map(
                (item) => (
                  <div key={item} className="rounded-lg bg-[#f7f8fb] p-4 text-sm font-semibold text-slate-700">
                    {item}
                  </div>
                )
              )}
            </div>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-black">Recent listing</h2>
            {recentOpportunities.map((opportunity) => (
              <OpportunityCard key={`${opportunity.title}-${opportunity.organization}`} opportunity={opportunity} />
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
