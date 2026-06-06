import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiExternalLink, FiMapPin } from "react-icons/fi";
import { PageViewTracker, TrackedExternalLink } from "@/components/Analytics";
import { Navbar } from "@/components/Navbar";
import { OpportunityCard } from "@/components/OpportunityCard";
import { ReferralCodeCard } from "@/components/ReferralCodeCard";
import { getOpportunityDeadlineLabel, getOpportunityDiscordUrl, getOpportunityLocationLabel, getOpportunityPosterUrl, getOpportunityReferralCode } from "@/lib/opportunity-display";
import { getStatusBadgeClass, sortOpportunitiesByDeadline } from "@/lib/opportunity-utils";
import { supabase } from "@/lib/supabase";
import type { Opportunity } from "@/types/opportunity";

export const dynamic = "force-dynamic";

type OpportunityDetailPageProps = {
  params: Promise<{ id: string }>;
};

const selectFields = "id, title, organization, category, status, description, location, tags, deadline, external_link, source_url, source_name, scraped_at, review_status, is_automated";

function isValidId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function normalizeOpportunity(opportunity: unknown) {
  if (!opportunity || typeof opportunity !== "object") {
    return null;
  }

  const row = opportunity as Opportunity;
  return {
    ...row,
    tags: Array.isArray(row.tags) ? row.tags : []
  } as Opportunity;
}

function StatePanel({ title, description }: { title: string; description: string }) {
  return (
    <main className="min-h-screen bg-[#040814] text-white">
      <PageViewTracker eventName="opportunity_detail_view" />
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
        <Link href="/opportunities" className="inline-flex items-center gap-2 text-sm font-black text-cyan-200 hover:text-cyan-100">
          <FiArrowLeft aria-hidden /> Back to opportunities
        </Link>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-xl shadow-black/10 backdrop-blur sm:p-10">
          <h1 className="text-2xl font-black text-white">{title}</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">{description}</p>
        </div>
      </section>
    </main>
  );
}

function OpportunityPoster({ posterUrl, title }: { posterUrl: string; title: string }) {
  return (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-xl shadow-black/20 backdrop-blur">
      <img
        src={posterUrl}
        alt={`${title} poster`}
        className="h-auto max-h-[70vh] w-full rounded-xl border border-white/10 object-contain shadow-2xl shadow-blue-950/20"
      />
    </section>
  );
}

function CommunityLinkCard({ url }: { url: string }) {
  return (
    <section className="rounded-2xl border border-indigo-300/20 bg-indigo-300/[0.07] p-5 shadow-xl shadow-indigo-950/10 backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-200">Community</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-indigo-200/25 bg-indigo-200/10 px-4 py-2 text-sm font-black text-indigo-50 transition hover:bg-indigo-200/15"
      >
        Join CodeStorm Discord Community <FiExternalLink aria-hidden />
      </a>
    </section>
  );
}

async function getOpportunity(id: string) {
  const { data, error } = await supabase
    .from("opportunities")
    .select(selectFields)
    .eq("id", id)
    .eq("review_status", "approved")
    .maybeSingle();

  if (error) {
    return { opportunity: null, related: [], error: error.message };
  }

  const opportunity = normalizeOpportunity(data);

  if (!opportunity) {
    return { opportunity: null, related: [], error: null };
  }

  const { data: relatedRows } = await supabase
    .from("opportunities")
    .select(selectFields)
    .eq("category", opportunity.category)
    .eq("review_status", "approved")
    .neq("id", id)
    .limit(3);

  const related = sortOpportunitiesByDeadline((relatedRows ?? []).map(normalizeOpportunity).filter(Boolean) as Opportunity[]);

  return { opportunity, related, error: null };
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const { id } = await params;

  if (!id || !isValidId(id)) {
    return <StatePanel title="Invalid opportunity link" description="This opportunity URL does not look valid." />;
  }

  const { opportunity, related, error } = await getOpportunity(id);

  if (error) {
    return <StatePanel title="Unable to load opportunity" description={error} />;
  }

  if (!opportunity) {
    return <StatePanel title="Opportunity not found" description="This opportunity may have been removed or is no longer available." />;
  }

  const posterUrl = getOpportunityPosterUrl(opportunity);
  const locationLabel = getOpportunityLocationLabel(opportunity);
  const referralCode = getOpportunityReferralCode(opportunity);
  const discordUrl = getOpportunityDiscordUrl(opportunity);

  return (
    <main className="min-h-screen bg-[#040814] text-white">
      <PageViewTracker eventName="opportunity_detail_view" />
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
        <Link href="/opportunities" className="inline-flex items-center gap-2 text-sm font-black text-cyan-200 hover:text-cyan-100">
          <FiArrowLeft aria-hidden /> Back to opportunities
        </Link>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
          <article className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10 backdrop-blur sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">{opportunity.category}</p>
                <h1 className="mt-3 break-words text-4xl font-black leading-tight text-white sm:text-5xl">{opportunity.title}</h1>
                <p className="mt-3 break-words text-base font-semibold text-slate-400">{opportunity.organization}</p>
              </div>
              <span className={`w-fit shrink-0 rounded-md px-3 py-1 text-xs font-black ${getStatusBadgeClass(opportunity.status)}`}>
                {opportunity.status}
              </span>
            </div>

            <div className="mt-7 flex min-w-0 flex-wrap gap-4 border-y border-white/10 py-5 text-sm font-semibold text-slate-400">
              <span className="inline-flex min-w-0 items-center gap-2 break-words">
                <FiCalendar aria-hidden /> Deadline: {getOpportunityDeadlineLabel(opportunity)}
              </span>
              <span className="inline-flex min-w-0 items-center gap-2 break-words">
                <FiMapPin aria-hidden /> {locationLabel}: {opportunity.location}
              </span>
            </div>

            {opportunity.tags.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {opportunity.tags.map((tag) => (
                  <span key={tag} className="max-w-full break-words rounded-md border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <p className="mt-7 whitespace-pre-wrap break-words text-base leading-8 text-slate-300">{opportunity.description}</p>

            {opportunity.external_link ? (
              <TrackedExternalLink
                href={opportunity.external_link}
                title={opportunity.title}
                category={opportunity.category}
                organization={opportunity.organization}
                className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-300 to-blue-400 px-5 py-3 text-sm font-black text-slate-950 transition duration-200 hover:from-cyan-200 hover:to-blue-300 sm:w-auto"
              >
                Open Opportunity <FiExternalLink aria-hidden />
              </TrackedExternalLink>
            ) : null}
          </article>

          <aside className="min-w-0">
            {posterUrl ? (
              <div className="mb-6">
                <OpportunityPoster posterUrl={posterUrl} title={opportunity.title} />
              </div>
            ) : null}
            {referralCode ? (
              <div className="mb-6">
                <ReferralCodeCard code={referralCode} />
              </div>
            ) : null}
            {discordUrl ? (
              <div className="mb-6">
                <CommunityLinkCard url={discordUrl} />
              </div>
            ) : null}
            <h2 className="text-xl font-black text-white">Related opportunities</h2>
            <div className="mt-4 grid gap-4">
              {related.length > 0 ? (
                related.map((item, index) => (
                  <OpportunityCard key={`${item.id ?? item.title}-${index}`} opportunity={item} />
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm font-semibold leading-6 text-slate-400">
                  No related opportunities in this category yet.
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
