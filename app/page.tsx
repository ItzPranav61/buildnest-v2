import Link from "next/link";
import { FiArrowRight, FiBriefcase, FiPlusCircle, FiTrendingUp } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { OpportunityCard } from "@/components/OpportunityCard";
import type { Opportunity } from "@/types/opportunity";

const featuredOpportunities: Opportunity[] = [
  {
    title: "Campus Web Sprint",
    organization: "BuildNest Labs",
    category: "Hackathon",
    status: "Open",
    description: "A weekend build challenge for student teams shipping helpful campus tools.",
    location: "Remote",
    tags: ["React", "UI", "Teamwork"],
    deadline: "Jun 12"
  },
  {
    title: "Product Design Fellow",
    organization: "Northstar Studio",
    category: "Fellowship",
    status: "Upcoming",
    description: "Work with mentors on research-backed product concepts for early-stage startups.",
    location: "Bengaluru",
    tags: ["Figma", "Research", "Prototyping"],
    deadline: "Jun 20"
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <Navbar />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-10 sm:px-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
        <div>
          <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800">
            Student builder opportunity board
          </span>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.02] tracking-normal text-slate-950 sm:text-6xl">
            Find your next project, sprint, internship, or campus build.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            BuildNest helps students discover practical opportunities, contribute real work, and keep momentum visible.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/opportunities"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
            >
              Browse opportunities <FiArrowRight aria-hidden />
            </Link>
            <Link
              href="/add"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:border-cyan-300 hover:bg-cyan-50"
            >
              <FiPlusCircle aria-hidden /> Add opportunity
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {featuredOpportunities.map((opportunity) => (
            <OpportunityCard key={`${opportunity.title}-${opportunity.organization}`} opportunity={opportunity} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-6 sm:grid-cols-3 sm:px-8">
          {[
            { label: "Live listings", value: "48", icon: FiBriefcase },
            { label: "Student teams", value: "1.2k", icon: FiTrendingUp },
            { label: "New this week", value: "14", icon: FiPlusCircle }
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-[#f7f8fb] p-5">
              <span className="grid size-11 place-items-center rounded-lg bg-cyan-100 text-cyan-800">
                <stat.icon aria-hidden />
              </span>
              <div>
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
