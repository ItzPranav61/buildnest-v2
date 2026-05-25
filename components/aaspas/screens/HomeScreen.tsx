import { BellRing, ChevronRight, MessageCircle, MoreHorizontal, Share2, ThumbsUp } from "lucide-react";
import { AppHeader } from "../ui/AppHeader";
import { BottomNav } from "../ui/BottomNav";
import { MobileFrame, PhoneStatus } from "../ui/MobileFrame";
import { happeningCards, quickActions, recentPost } from "../data";
import { HomeHeroArt, SunsetPhoto } from "../illustrations/HomeHeroArt";

export function HomeScreen() {
  return (
    <MobileFrame>
      <div className="relative min-h-screen pb-[118px]">
        <PhoneStatus />
        <AppHeader />

        <div className="mt-8 space-y-7 px-[14px]">
          <HeroCard />
          <QuickActions />
          <HappeningSection />
          <RecentPost />
        </div>

        <BottomNav active="home" />
      </div>
    </MobileFrame>
  );
}

function HeroCard() {
  return (
    <section className="relative h-[160px] overflow-hidden rounded-[18px] border border-[#dfe9e2] bg-[#eef8f1] shadow-[0_7px_18px_rgba(15,23,42,0.06)]">
      <HomeHeroArt />
      <div className="relative z-10 w-[245px] px-[15px] py-[18px]">
        <h1 className="text-[27px] font-black leading-[1.15] tracking-[-0.03em]">
          Good Morning,
          <br />
          <span className="text-[#07864f]">Badlapur!</span> <span className="text-[24px]">👋</span>
        </h1>
        <p className="mt-3 text-[15px] font-medium leading-[1.35] text-[#666b73]">
          Stay connected. Stay informed. Let&apos;s build a stronger community together.
        </p>
        <button className="mt-4 inline-flex h-11 items-center gap-3 rounded-md bg-gradient-to-r from-[#07864f] to-[#057c47] px-4 text-[16px] font-black text-white shadow-[0_10px_20px_rgba(0,118,65,0.24)]" type="button">
          Explore Updates <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  );
}

function QuickActions() {
  return (
    <div className="grid grid-cols-5 gap-x-[16px] gap-y-[22px] px-1">
      {quickActions.map((item) => {
        const Icon = item.icon;
        return (
          <button key={item.label} className="flex flex-col items-center gap-2 text-center" type="button">
            <span className={`grid size-[56px] place-items-center rounded-[17px] ${item.tone}`}>
              <Icon className="size-8" strokeWidth={2.2} />
            </span>
            <span className="min-h-[34px] text-[13.5px] font-medium leading-[17px] text-[#101217]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between px-1">
      <h2 className="min-w-0 text-[22px] font-black tracking-[-0.03em]">{title}</h2>
      {action && (
        <button className="shrink-0 pl-2 text-[16px] font-black text-[#07864f]" type="button">
          {action}
        </button>
      )}
    </div>
  );
}

function HappeningSection() {
  return (
    <section>
      <SectionTitle title="What’s Happening in Badlapur" action="View All" />
      <div className="-mx-[14px] flex gap-3 overflow-x-auto px-[14px] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {happeningCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="min-h-[132px] w-[136px] shrink-0 rounded-[14px] border border-[#e1e7e4] bg-white p-3 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-2">
                <span className={`rounded-md px-2 py-1 text-[12px] font-black leading-none ${card.tagTone}`}>{card.tag}</span>
                <Icon className={`size-8 shrink-0 ${card.tone}`} />
              </div>
              <h3 className="mt-3 text-[17px] font-black leading-[1.12] tracking-[-0.02em]">{card.title}</h3>
              <p className="mt-3 line-clamp-3 text-[14px] leading-[1.3] text-[#5d626a]">{card.body}</p>
              <p className="mt-3 text-[11px] text-[#6f747c]">{card.meta ? `${card.meta}  ` : ""}{card.time}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RecentPost() {
  return (
    <section>
      <SectionTitle title="Recent Posts" action="View All" />
      <article className="rounded-[19px] border border-[#e0e6e3] bg-white p-3 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
        <div className="flex items-start gap-3">
          <div className="relative size-[52px] shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#f4cf9f] to-[#15834e]">
            <div className="mx-auto mt-2 size-8 rounded-full bg-[#4b2b1f]" />
            <div className="absolute bottom-0 left-1/2 h-7 w-10 -translate-x-1/2 rounded-t-full bg-[#f1bd31]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-[19px] font-black leading-none tracking-[-0.02em]">{recentPost.author}</h3>
              <span className="rounded-md bg-[#e4f7eb] px-2 py-1 text-[12px] font-black leading-none text-[#07864f]">{recentPost.role}</span>
            </div>
            <p className="mt-2 text-[15px] leading-none text-[#737780]">{recentPost.location} • {recentPost.time}</p>
          </div>
          <MoreHorizontal className="size-6 text-[#6f747c]" />
        </div>

        <p className="mt-4 text-[18px] leading-[1.35] tracking-[-0.01em]">
          {recentPost.text}
          <br />
          <span className="font-medium text-[#07864f]">{recentPost.tag}</span>
        </p>
        <div className="mt-3">
          <SunsetPhoto />
        </div>
        <div className="mt-4 flex items-center justify-between px-1 text-[15px] font-medium text-[#626872]">
          <button className="flex items-center gap-2 text-[#07864f]" type="button">
            <ThumbsUp className="size-6" /> 56
          </button>
          <button className="flex items-center gap-2" type="button">
            <MessageCircle className="size-6" /> 12 Comments
          </button>
          <button className="flex items-center gap-2" type="button">
            <Share2 className="size-6" /> Share
          </button>
          <button type="button" aria-label="Save post">
            <BellRing className="size-6" />
          </button>
        </div>
      </article>
    </section>
  );
}
