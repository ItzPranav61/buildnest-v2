import Link from "next/link";
import { FiCalendar, FiExternalLink, FiMapPin } from "react-icons/fi";
import { TrackedExternalLink } from "@/components/Analytics";
import { formatDeadline, getStatusBadgeClass } from "@/lib/opportunity-utils";
import type { Opportunity } from "@/types/opportunity";

type OpportunityCardProps = {
  opportunity: Opportunity;
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const tags = Array.isArray(opportunity.tags) ? opportunity.tags : [];
  const detailHref = opportunity.id ? `/opportunity/${opportunity.id}` : null;

  return (
    <article className="w-full max-w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl shadow-black/10 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:shadow-cyan-950/20 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-cyan-300">{opportunity.category}</p>
          <h2 className="mt-2 break-words text-xl font-black leading-6 text-white">
            {detailHref ? (
              <Link href={detailHref} className="transition hover:text-cyan-100">
                {opportunity.title}
              </Link>
            ) : (
              opportunity.title
            )}
          </h2>
          <p className="mt-1 break-words text-sm font-semibold text-slate-400">{opportunity.organization}</p>
        </div>
        <span className={`shrink-0 rounded-md px-3 py-1 text-xs font-black ${getStatusBadgeClass(opportunity.status)}`}>
          {opportunity.status}
        </span>
      </div>

      <p className="mt-4 break-words text-sm leading-6 text-slate-300">{opportunity.description}</p>

      {detailHref ? (
        <Link href={detailHref} className="mt-4 inline-flex text-sm font-black text-cyan-200 transition hover:text-cyan-100">
          View details
        </Link>
      ) : null}

      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="max-w-full break-words rounded-md border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex min-w-0 flex-wrap items-center gap-4 border-t border-white/10 pt-4 text-sm font-semibold text-slate-400">
        <span className="inline-flex min-w-0 items-center gap-2 break-words">
          <FiMapPin aria-hidden /> {opportunity.location}
        </span>
        <span className="inline-flex min-w-0 items-center gap-2 break-words">
          <FiCalendar aria-hidden /> Apply by {formatDeadline(opportunity.deadline)}
        </span>
      </div>

      {opportunity.external_link ? (
        <TrackedExternalLink
          href={opportunity.external_link}
          title={opportunity.title}
          category={opportunity.category}
          organization={opportunity.organization}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-300 to-blue-400 px-4 py-2 text-sm font-black text-slate-950 transition duration-200 hover:from-cyan-200 hover:to-blue-300"
        >
          Open Opportunity <FiExternalLink aria-hidden />
        </TrackedExternalLink>
      ) : null}
    </article>
  );
}
