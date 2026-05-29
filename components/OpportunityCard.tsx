import { FiCalendar, FiMapPin } from "react-icons/fi";
import { formatDeadline, getStatusBadgeClass } from "@/lib/opportunity-utils";
import type { Opportunity } from "@/types/opportunity";

type OpportunityCardProps = {
  opportunity: Opportunity;
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const tags = Array.isArray(opportunity.tags) ? opportunity.tags : [];

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:shadow-cyan-950/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-cyan-300">{opportunity.category}</p>
          <h2 className="mt-2 text-xl font-black leading-6 text-white">{opportunity.title}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-400">{opportunity.organization}</p>
        </div>
        <span className={`shrink-0 rounded-md px-3 py-1 text-xs font-black ${getStatusBadgeClass(opportunity.status)}`}>
          {opportunity.status}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{opportunity.description}</p>

      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 text-sm font-semibold text-slate-400">
        <span className="inline-flex items-center gap-2">
          <FiMapPin aria-hidden /> {opportunity.location}
        </span>
        <span className="inline-flex items-center gap-2">
          <FiCalendar aria-hidden /> Apply by {formatDeadline(opportunity.deadline)}
        </span>
      </div>
    </article>
  );
}
