import Link from "next/link";
import Image from "next/image";
import {
  FiArrowRight,
  FiBookOpen,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiCode,
  FiExternalLink,
  FiFlag,
  FiGlobe,
  FiLayers,
  FiPlusCircle,
  FiRadio,
  FiSearch,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { formatDeadline, getStatusBadgeClass, sortOpportunitiesByDeadline } from "@/lib/opportunity-utils";
import { supabase } from "@/lib/supabase";
import type { Opportunity } from "@/types/opportunity";

const heroImage = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=2200&q=85";
const mascotGlow = "drop-shadow-[0_0_30px_rgba(59,130,246,.25)]";

export const dynamic = "force-dynamic";

const journey = [
  {
    title: "Discover",
    description: "Find internships, hackathons, fellowships, and OSS work without sorting through noisy feeds.",
    icon: FiSearch
  },
  {
    title: "Shortlist",
    description: "Read status, deadline, category, and tags in one calm surface built for comparison.",
    icon: FiBookOpen
  },
  {
    title: "Ship",
    description: "Turn the opportunity into proof of work, a shipped project, or a stronger builder profile.",
    icon: FiCode
  }
];

function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">{description}</p> : null}
    </div>
  );
}

function GlassOpportunity({ opportunity }: { opportunity: Opportunity }) {
  const tags = Array.isArray(opportunity.tags) ? opportunity.tags : [];

  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-cyan-300">{opportunity.category}</p>
          <h3 className="mt-1 text-xl font-black leading-6 text-white">{opportunity.title}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-400">{opportunity.organization}</p>
        </div>
        <span className={`shrink-0 rounded-md px-3 py-1 text-xs font-black ${getStatusBadgeClass(opportunity.status)}`}>
          {opportunity.status}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{opportunity.description}</p>
      <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-400">
        <FiCalendar aria-hidden /> Apply by {formatDeadline(opportunity.deadline)}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-md border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-bold text-slate-200">
            {tag}
          </span>
        ))}
      </div>
      {opportunity.external_link ? (
        <a
          href={opportunity.external_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-300 to-blue-400 px-4 py-2 text-sm font-black text-slate-950 transition duration-200 hover:from-cyan-200 hover:to-blue-300"
        >
          Open Opportunity <FiExternalLink aria-hidden />
        </a>
      ) : null}
    </article>
  );
}

function EmptyOpportunitiesState() {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur">
      <h3 className="text-xl font-black text-white">No live opportunities yet.</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        Published Supabase opportunities will appear here as soon as they are added.
      </p>
    </div>
  );
}

function NestBotImage({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/nestbot.png"
      alt="NestBot"
      width={180}
      height={180}
      className={`${mascotGlow} object-contain ${className}`}
      priority
    />
  );
}

async function getOpportunities() {
  const { data, error } = await supabase
    .from("opportunities")
    .select("id, title, organization, category, status, description, location, tags, deadline, external_link");

  if (error) {
    return { opportunities: [], error: error.message };
  }

  const opportunities = (data ?? []).map((opportunity) => ({
    ...opportunity,
    tags: Array.isArray(opportunity.tags) ? opportunity.tags : []
  })) as Opportunity[];

  return {
    opportunities: sortOpportunitiesByDeadline(opportunities),
    error: null
  };
}

function getLiveStats(opportunities: Opportunity[]) {
  const categories = new Set(opportunities.map((opportunity) => opportunity.category.trim()).filter(Boolean));

  return [
    { label: "Live opportunities", value: String(opportunities.length), icon: FiBriefcase },
    { label: "Active tracks", value: String(opportunities.filter((opportunity) => opportunity.status === "Open").length), icon: FiCheckCircle },
    { label: "Upcoming", value: String(opportunities.filter((opportunity) => opportunity.status === "Upcoming").length), icon: FiFlag },
    { label: "Builder tracks", value: String(categories.size), icon: FiLayers }
  ];
}

export default async function HomePage() {
  const { opportunities, error } = await getOpportunities();
  const featuredOpportunities = opportunities.slice(0, 3);
  const stats = getLiveStats(opportunities);

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <Navbar />

      <section
        className="relative min-h-[78svh] max-w-full overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,13,0.96)_0%,rgba(5,7,13,0.86)_46%,rgba(5,7,13,0.46)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[260px] bg-gradient-to-b from-transparent via-[#040814]/40 to-[#040814]" />

        <div className="relative mx-auto flex min-h-[78svh] w-full max-w-7xl items-center px-4 py-14 sm:px-8">
          <div className="w-full max-w-4xl min-w-0">
            <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 backdrop-blur">
              Built for students who ship
            </span>
            <h1 className="mt-6 break-words text-4xl font-black leading-[1.04] tracking-normal text-white min-[375px]:text-5xl sm:text-6xl lg:text-7xl">
              Signal for students who ship.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              BuildNest is a student builder radar for finding opportunities, building proof, and choosing ship over scroll.
            </p>
            <div className="mt-8 flex min-w-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/opportunities"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-black/20 transition hover:bg-cyan-100"
              >
                Browse opportunities <FiArrowRight aria-hidden />
              </Link>
              <Link
                href="/add"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.08] px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/10"
              >
                <FiPlusCircle aria-hidden /> Add opportunity
              </Link>
            </div>

            <div className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
              {["Curated, not noisy", "Deadline-aware", "Builder-first"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-bold text-slate-200 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="radar" className="border-b border-white/10 bg-[#080b12]">
        <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-8 px-4 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center">
          <SectionHeading
            eyebrow="Opportunity Radar Preview"
            title="Signal over scroll."
            description="Radar is the product lens for the board: clean status, category, tags, and deadline context so student builders can decide faster."
          />

          <div className="w-full max-w-full min-w-0 rounded-lg border border-white/10 bg-white/[0.05] p-3 shadow-2xl shadow-black/30 backdrop-blur sm:p-4">
            <div className="rounded-lg border border-white/10 bg-[#07111f]/90 p-4">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-bold text-cyan-300">Live board behavior</p>
                  <h3 className="mt-1 text-2xl font-black">Nearest deadlines surface first.</h3>
                </div>
                <span className="grid size-11 place-items-center rounded-lg bg-cyan-300/15 text-cyan-200">
                  <FiRadio aria-hidden />
                </span>
              </div>

              {error ? (
                <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm font-semibold text-red-200">
                  Unable to load opportunities: {error}
                </div>
              ) : null}

              <div className="mt-4 grid gap-3">
                {featuredOpportunities.length > 0 ? (
                  featuredOpportunities.map((opportunity) => (
                    <div key={`${opportunity.title}-${opportunity.organization}-${opportunity.deadline}`} className="w-full max-w-full min-w-0 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase text-slate-500">{opportunity.category}</p>
                          <p className="mt-1 break-words font-black text-white">{opportunity.title}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            {formatDeadline(opportunity.deadline)}
                          </p>
                        </div>
                        <span className={`rounded-md px-3 py-1 text-xs font-black ${getStatusBadgeClass(opportunity.status)}`}>
                          {opportunity.status}
                        </span>
                      </div>
                      {opportunity.external_link ? (
                        <a
                          href={opportunity.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-black text-cyan-100 transition hover:bg-cyan-300/15"
                        >
                          Open Opportunity <FiExternalLink aria-hidden />
                        </a>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <EmptyOpportunitiesState />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-bold text-slate-400">{stat.label}</p>
                <span className="grid size-10 place-items-center rounded-lg bg-white/10 text-cyan-200">
                  <stat.icon aria-hidden />
                </span>
              </div>
              <p className="mt-4 text-3xl font-black">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="featured" className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Featured Opportunities" title="A board that rewards momentum." />
          <Link href="/opportunities" className="inline-flex items-center gap-2 text-sm font-black text-cyan-200 hover:text-cyan-100">
            View live board <FiArrowRight aria-hidden />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {featuredOpportunities.length > 0 ? (
            featuredOpportunities.map((opportunity) => (
              <GlassOpportunity key={`${opportunity.title}-${opportunity.organization}-${opportunity.deadline}`} opportunity={opportunity} />
            ))
          ) : (
            <div className="lg:col-span-3">
              <EmptyOpportunitiesState />
            </div>
          )}
        </div>
      </section>

      <section id="journey" className="border-y border-white/10 bg-[#080b12]">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8">
          <SectionHeading eyebrow="Student Builder Journey" title="From finding signal to shipping proof." />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {journey.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-white/10 bg-white/[0.05] p-6 backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-lg bg-cyan-300/15 text-cyan-200">
                    <step.icon aria-hidden />
                  </span>
                  <span className="text-sm font-black text-slate-500">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-2xl font-black">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="mx-auto grid w-full max-w-7xl min-w-0 gap-8 px-4 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <SectionHeading
          eyebrow="Community"
          title="A builder circle, not a job board clone."
          description="BuildNest is for students who want useful peers, practical direction, and opportunities that turn curiosity into real work."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: "Peer momentum", description: "See what others are building toward and choose your next move.", mascot: true },
            { title: "Open access", description: "Remote, local, campus, and OSS paths can live in one focused place.", icon: FiGlobe }
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-white/10 bg-white/[0.05] p-6 backdrop-blur">
              {item.mascot ? (
                <span className="grid size-14 place-items-center rounded-lg border border-blue-300/15 bg-white/10">
                  <NestBotImage className="h-12 w-12" />
                </span>
              ) : item.icon ? (
                <span className="grid size-11 place-items-center rounded-lg bg-white/10 text-cyan-200">
                  <item.icon aria-hidden />
                </span>
              ) : null}
              <h3 className="mt-6 text-xl font-black">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#05070d]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-black">BuildNest</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">Focused opportunity discovery for student builders.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-400">
            <Link href="/opportunities" className="hover:text-white">
              Opportunities
            </Link>
            <Link href="/add" className="hover:text-white">
              Add
            </Link>
            <Link href="/login" className="hover:text-white">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
