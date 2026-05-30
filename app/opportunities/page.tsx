import { PageViewTracker } from "@/components/Analytics";
import { Navbar } from "@/components/Navbar";
import { OpportunitiesList } from "@/components/OpportunitiesList";
import { supabase } from "@/lib/supabase";
import type { Opportunity } from "@/types/opportunity";

export const dynamic = "force-dynamic";

async function getOpportunities() {
  const { data, error } = await supabase
    .from("opportunities")
    .select("id, title, organization, category, status, description, location, tags, deadline, external_link, source_url, source_name, scraped_at, review_status, is_automated")
    .eq("review_status", "approved");

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
    <main className="min-h-screen bg-[#040814] text-white">
      <PageViewTracker eventName="opportunities_view" />
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Opportunities</p>
            <h1 className="mt-2 break-words text-4xl font-black tracking-normal text-white sm:text-5xl">Browse student-ready work</h1>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-400">
            Live opportunities from the BuildNest radar, sorted for builder momentum.
          </p>
        </div>

        {error ? (
          <div className="mt-8 rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-sm font-semibold text-red-200">
            Unable to load opportunities: {error}
          </div>
        ) : (
          <OpportunitiesList opportunities={opportunities} />
        )}
      </section>
    </main>
  );
}
