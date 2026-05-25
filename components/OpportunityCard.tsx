import { FiCalendar, FiMapPin } from "react-icons/fi";
import type { Opportunity } from "@/types/opportunity";

type OpportunityCardProps = {
  opportunity: Opportunity;
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const tags = Array.isArray(opportunity.tags) ? opportunity.tags : [];

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-cyan-700">{opportunity.category}</p>
          <h2 className="mt-1 text-xl font-black leading-6 text-slate-950">{opportunity.title}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">{opportunity.organization}</p>
        </div>
        <span className="shrink-0 rounded-md bg-lime-100 px-3 py-1 text-xs font-black text-lime-800">{opportunity.status}</span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{opportunity.description}</p>

      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-md bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-500">
        <span className="inline-flex items-center gap-2">
          <FiMapPin aria-hidden /> {opportunity.location}
        </span>
        <span className="inline-flex items-center gap-2">
          <FiCalendar aria-hidden /> Apply by {opportunity.deadline}
        </span>
      </div>
    </article>
  );
}
