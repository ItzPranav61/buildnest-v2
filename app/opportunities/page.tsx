import { Navbar } from "@/components/Navbar";
import { OpportunitiesList } from "@/components/OpportunitiesList";
import { supabase } from "@/lib/supabase";
import type { Opportunity } from "@/types/opportunity";

export const dynamic = "force-dynamic";

async function getOpportunities() {
  const { data, error } = await supabase
    .from("opportunities")
    .select("title, organization, category, status, description, location, tags, deadline");

  if (error) {
    return { opportunities: [], error: error.message };
  }

  return {
    opportunities: (data ?? []).map((opportunity) => ({
      ...opportunity,
      tags: Array.isArray(opportunity.tags) ? opportunity.tags : []
    })) as Opportunity[],
    error: null
  };
}

export default async function OpportunitiesPage() {
  const { opportunities, error } = await getOpportunities();

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <Navbar />
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Opportunities</p>
            <h1 className="mt-2 text-4xl font-black tracking-normal sm:text-5xl">Browse student-ready work</h1>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600">
            Live listings from Supabase. Filters are scaffolded for layout and future wiring.
          </p>
        </div>

        {error ? (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
            Unable to load opportunities: {error}
          </div>
        ) : (
          <OpportunitiesList opportunities={opportunities} />
        )}
      </section>
    </main>
  );
}
