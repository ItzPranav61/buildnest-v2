"use client";

import { useEffect, useMemo, useState } from "react";
import { Filters } from "@/components/Filters";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Toast, type ToastState } from "@/components/Toast";
import { sortOpportunitiesByDeadline } from "@/lib/opportunity-utils";
import type { Opportunity } from "@/types/opportunity";

type OpportunitiesListProps = {
  opportunities: Opportunity[];
};

export function OpportunitiesList({ opportunities }: OpportunitiesListProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [toast, setToast] = useState<ToastState>(null);

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = opportunities.filter((opportunity) => {
      const matchesSearch =
        query.length === 0 ||
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.organization.toLowerCase().includes(query);
      const matchesCategory = category === "All" || opportunity.category === category;
      const matchesStatus = status === "All" || opportunity.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    return sortOpportunitiesByDeadline(filtered);
  }, [category, opportunities, search, status]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("created") === "1") {
      setToast({ type: "success", message: "Opportunity added" });
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="mt-8 grid w-full max-w-full min-w-0 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Filters
          search={search}
          category={category}
          status={status}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
        />

        {opportunities.length === 0 ? (
          <div className="w-full max-w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center shadow-xl shadow-black/10 backdrop-blur sm:p-10">
            <h2 className="text-xl font-black text-white">No opportunities yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Once an opportunity is added, student builders will see it here with tags, status, and deadline details.
            </p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="w-full max-w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center shadow-xl shadow-black/10 backdrop-blur sm:p-10">
            <h2 className="text-xl font-black text-white">No matching opportunities</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Adjust the search, category, or status filters to find a matching listing.
            </p>
          </div>
        ) : (
          <div className="grid w-full max-w-full min-w-0 gap-4 md:grid-cols-2">
            {filteredOpportunities.map((opportunity, index) => (
              <OpportunityCard
                key={`${opportunity.title}-${opportunity.organization}-${opportunity.deadline}-${index}`}
                opportunity={opportunity}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
