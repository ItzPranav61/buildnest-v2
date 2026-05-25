"use client";

import { useMemo, useState } from "react";
import { Filters } from "@/components/Filters";
import { OpportunityCard } from "@/components/OpportunityCard";
import type { Opportunity } from "@/types/opportunity";

type OpportunitiesListProps = {
  opportunities: Opportunity[];
};

export function OpportunitiesList({ opportunities }: OpportunitiesListProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return opportunities.filter((opportunity) => {
      const matchesSearch =
        query.length === 0 ||
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.organization.toLowerCase().includes(query);
      const matchesCategory = category === "All" || opportunity.category === category;
      const matchesStatus = status === "All" || opportunity.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [category, opportunities, search, status]);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
      <Filters
        search={search}
        category={category}
        status={status}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
      />

      {opportunities.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-black text-slate-950">No opportunities yet</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add the first student builder opportunity and it will appear here.
          </p>
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-black text-slate-950">No matching opportunities</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Try a different title, organization, category, or status.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredOpportunities.map((opportunity, index) => (
            <OpportunityCard
              key={`${opportunity.title}-${opportunity.organization}-${opportunity.deadline}-${index}`}
              opportunity={opportunity}
            />
          ))}
        </div>
      )}
    </div>
  );
}
