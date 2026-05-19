"use client";

import {
  Bell,
  ChevronDown,
  ChevronRight,
  Globe2,
  Heart,
  Home,
  Image,
  LockKeyhole,
  MapPin,
  Menu,
  MessageCircle,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
  Send,
  Share2,
  ShieldCheck,
  ThumbsUp,
  UserRound,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  areaAlerts,
  chatTabs,
  essentials,
  exploreGroups,
  groupCategories,
  happeningCards,
  insights,
  localities,
  NavTab,
  peopleYouMayKnow,
  pinnedChats,
  postOptions,
  quickActions,
  recentChats,
  recentPosts,
  yourGroups
} from "@/lib/aaspas-data";
import type { LucideIcon } from "lucide-react";
import { BadlapurHeroArt, BadlapurMapArt, NeighborhoodIllustration, SunsetStrip } from "./Illustrations";
import { Brand, LogoMark } from "./Brand";

const navItems: { id: NavTab; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "groups", label: "Groups", icon: Users },
  { id: "post", label: "Post", icon: Plus },
  { id: "chats", label: "Chats", icon: MessageCircle },
  { id: "area", label: "My Area", icon: MapPin }
];

export function AaspasApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("home");

  const screenTitle = useMemo(() => navItems.find((item) => item.id === activeTab)?.label ?? "Home", [activeTab]);

  if (!isLoggedIn) {
    return <LoginScreen onContinue={() => setIsLoggedIn(true)} />;
  }

  return (
    <main className="min-h-screen bg-[#f7fbf8] text-slate-950">
      <div className="mx-auto min-h-screen w-full max-w-[920px] bg-white shadow-2xl shadow-emerald-950/10 md:my-6 md:min-h-[900px] md:rounded-[2.5rem] md:border md:border-slate-200">
        <div className="px-5 pb-28 pt-5 sm:px-8">
          <PhoneStatus />
          <AppHeader title={screenTitle} activeTab={activeTab} />
          {activeTab === "home" && <HomeScreen />}
          {activeTab === "groups" && <GroupsScreen />}
          {activeTab === "post" && <PostScreen />}
          {activeTab === "chats" && <ChatsScreen />}
          {activeTab === "area" && <AreaScreen />}
        </div>
        <BottomNavigation activeTab={activeTab} onChange={setActiveTab} />
      </div>
    </main>
  );
}

function LoginScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <main className="min-h-screen bg-[#f3fbf4] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[760px] flex-col overflow-hidden bg-white shadow-2xl shadow-emerald-950/10 md:my-6 md:min-h-[900px] md:rounded-[2.7rem]">
        <div className="relative">
          <NeighborhoodIllustration />
          <div className="absolute left-5 top-6 rounded-3xl bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
            <div className="flex items-center gap-2 text-base font-bold">
              <Globe2 className="size-5" />
              English
              <ChevronDown className="size-4" />
            </div>
          </div>
          <div className="absolute right-5 top-6 rounded-3xl bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
            <div className="flex items-center gap-2 text-base font-bold">
              <ShieldCheck className="size-5 text-emerald-600" />
              Safe & Secure
            </div>
          </div>
        </div>
        <section className="-mt-8 flex flex-1 flex-col items-center rounded-t-[3rem] bg-white px-6 pb-8 pt-4">
          <LogoMark />
          <h1 className="mt-3 text-6xl font-black tracking-normal text-emerald-950">Aaspas</h1>
          <p className="mt-2 text-center text-xl font-semibold">
            Your Local. Your People. <span className="text-emerald-700">Your Community.</span>
          </p>
          <div className="my-5 flex items-center gap-5 text-emerald-500">
            <span className="h-px w-16 bg-slate-200" />
            <Heart className="size-5" fill="currentColor" />
            <span className="h-px w-16 bg-slate-200" />
          </div>
          <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-emerald-950/10">
            <button
              type="button"
              onClick={onContinue}
              className="group flex w-full items-center justify-between rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-600 p-4 text-left text-white shadow-lg shadow-emerald-900/25 transition active:scale-[0.99]"
            >
              <span className="grid size-14 place-items-center rounded-2xl bg-white/90 text-emerald-700">
                <LockKeyhole className="size-7" />
              </span>
              <span className="min-w-0 flex-1 px-4">
                <span className="block text-xl font-extrabold">Continue with Mobile</span>
                <span className="block text-sm text-white/85">We will send you an OTP to verify your number</span>
              </span>
              <ChevronRight className="size-8 transition group-hover:translate-x-1" />
            </button>
            <div className="mt-4 grid gap-3">
              <button className="auth-button" type="button" onClick={onContinue}>
                <span className="text-2xl font-black text-blue-600">G</span>
                Continue with Google
              </button>
              <div className="flex items-center gap-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                Or continue with
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="auth-button" type="button">
                  <MessageCircle className="size-5 text-emerald-700" />
                  Email
                </button>
                <button className="auth-button" type="button">
                  <LockKeyhole className="size-5 text-emerald-700" />
                  Password
                </button>
              </div>
            </div>
            <p className="mt-5 text-center text-sm leading-6 text-slate-500">
              By continuing, you agree to our <span className="font-semibold text-emerald-700">Terms of Service</span> and{" "}
              <span className="font-semibold text-emerald-700">Privacy Policy</span>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function PhoneStatus() {
  return (
    <div className="mb-4 flex items-center justify-between px-1 text-sm font-bold text-slate-950 md:hidden">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="h-3 w-1 rounded-full bg-slate-950" />
        <span className="h-4 w-1 rounded-full bg-slate-950" />
        <span className="h-5 w-1 rounded-full bg-slate-950" />
        <span className="ml-1 h-4 w-7 rounded border-2 border-slate-950" />
      </span>
    </div>
  );
}

function AppHeader({ activeTab }: { title: string; activeTab: NavTab }) {
  const isHome = activeTab === "home";
  return (
    <header className="mb-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="icon-button" type="button" aria-label="Open menu">
            <Menu className="size-6" />
          </button>
          <Brand compact />
        </div>
        <div className="flex items-center gap-3">
          {(activeTab === "groups" || activeTab === "chats") && (
            <button className="icon-button hidden sm:grid" type="button" aria-label="Search">
              <Search className="size-6" />
            </button>
          )}
          <button className="icon-button relative" type="button" aria-label="Notifications">
            <Bell className="size-6" />
            <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-red-500 text-[11px] font-bold text-white">
              3
            </span>
          </button>
          <Avatar label="RS" />
        </div>
      </div>
      <div className="mt-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 size-7 text-emerald-700" fill="currentColor" />
          <div>
            <button type="button" className="flex items-center gap-2 text-2xl font-black tracking-normal">
              Badlapur <ChevronDown className="size-5" />
            </button>
            <p className="text-base text-slate-500">Thane, Maharashtra</p>
          </div>
        </div>
        {isHome && (
          <div className="hidden text-right sm:block">
            <p className="text-2xl font-bold">29°C</p>
            <p className="text-sm text-slate-500">Partly Cloudy</p>
          </div>
        )}
        {activeTab === "area" && (
          <button className="secondary-button hidden sm:flex" type="button">
            <PenLine className="size-4" />
            Edit Area
          </button>
        )}
      </div>
    </header>
  );
}

function HomeScreen() {
  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-emerald-50 p-6 shadow-sm">
        <BadlapurHeroArt />
        <div className="relative max-w-[55%] min-w-[245px]">
          <h2 className="text-3xl font-black leading-tight">
            Good Morning, <span className="text-emerald-700">Badlapur!</span>
          </h2>
          <p className="mt-4 text-base leading-6 text-slate-600">Stay connected. Stay informed. Let us build a stronger community together.</p>
          <button className="primary-button mt-6" type="button">
            Explore Updates <ChevronRight className="size-5" />
          </button>
        </div>
      </section>
      <IconGrid items={quickActions} columns="grid-cols-3 sm:grid-cols-5" />
      <SectionHeader title="What’s Happening in Badlapur" action="View All" />
      <div className="scroll-row">
        {happeningCards.map((card) => (
          <article key={card.title} className="min-w-[245px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{card.tag}</span>
              <card.icon className={`size-8 ${card.tone.split(" ")[0]}`} />
            </div>
            <h3 className="mt-4 text-xl font-black leading-tight">{card.title}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{card.body}</p>
            <p className="mt-4 text-xs text-slate-500">{card.source} · {card.time}</p>
          </article>
        ))}
      </div>
      <SectionHeader title="Recent Posts" action="View All" />
      <PostList limit={1} />
    </div>
  );
}

function GroupsScreen() {
  return (
    <div className="space-y-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="screen-title">Groups</h1>
          <p className="screen-subtitle">Connect, collaborate and grow with your community.</p>
        </div>
        <button className="primary-button shrink-0" type="button">
          <Users className="size-5" />
          Create Group
        </button>
      </div>
      <IconGrid items={groupCategories} columns="grid-cols-3 sm:grid-cols-5" showCount />
      <SectionHeader title="Your Groups" action="View All" />
      <div className="space-y-4">
        {yourGroups.map((group) => (
          <GroupCard key={group.name} group={group} joined />
        ))}
      </div>
      <SectionHeader title="Explore Groups" action="See All" />
      <div className="space-y-4">
        {exploreGroups.map((group) => (
          <GroupCard key={group.name} group={group} />
        ))}
      </div>
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-emerald-50/60 p-4">
        <div className="grid size-16 place-items-center rounded-2xl bg-white text-emerald-700">
          <Users className="size-8" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-black">Groups make communities stronger!</h3>
          <p className="text-sm leading-6 text-slate-600">Join relevant groups or create your own to connect with people around you.</p>
        </div>
        <button className="primary-button hidden sm:flex" type="button">Learn More</button>
      </div>
    </div>
  );
}

function PostScreen() {
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="screen-title">Create Post</h1>
          <p className="screen-subtitle">Share updates, alerts and moments with Badlapur.</p>
        </div>
        <button className="secondary-button" type="button">
          <Globe2 className="size-4" />
          Public
        </button>
      </div>
      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <textarea
          className="min-h-28 w-full resize-none rounded-2xl bg-emerald-50/60 p-4 text-xl font-bold outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-600"
          placeholder="What’s on your mind, Badlapur?"
        />
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
          {postOptions.map((option) => (
            <button key={option.label} type="button" className="tap-card min-h-20 flex-col gap-2 p-2 text-center text-xs">
              <option.icon className={`size-6 ${option.tone.split(" ")[0]}`} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
          <button className="primary-button min-w-32 justify-center" type="button">Post</button>
        </div>
      </section>
      <SectionHeader title="Recent Posts in Badlapur" action="See All" />
      <PostList />
    </div>
  );
}

function ChatsScreen() {
  return (
    <div className="space-y-7">
      <div className="grid gap-4 sm:grid-cols-[1fr_0.8fr] sm:items-start">
        <div>
          <h1 className="screen-title">Chats</h1>
          <p className="screen-subtitle">Connect with people and groups in your community.</p>
        </div>
        <label className="flex h-14 items-center gap-3 rounded-2xl bg-slate-100 px-4 text-slate-500">
          <Search className="size-5" />
          <input className="w-full bg-transparent outline-none" placeholder="Search chats" />
        </label>
      </div>
      <div className="scroll-row">
        {chatTabs.map((tab, index) => (
          <button key={tab} className={`pill ${index === 0 ? "pill-active" : ""}`} type="button">
            {tab}
            {tab === "Announcements" && <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-xs text-white">2</span>}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-emerald-50/70 p-4">
        <div className="grid size-16 place-items-center rounded-2xl bg-white text-emerald-700">
          <MessageCircle className="size-8" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black">Stay connected with your community</h3>
          <p className="text-sm leading-6 text-slate-600">Message your groups, neighbours and local businesses easily.</p>
        </div>
        <button className="primary-button shrink-0" type="button">
          <MessageCircle className="size-5" />
          New Chat
        </button>
      </div>
      <ChatList title="Pinned" chats={pinnedChats} pinned />
      <ChatList title="Recent Chats" chats={recentChats} action="View All" />
      <SectionHeader title="People you may know" action="View All" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {peopleYouMayKnow.map((person) => (
          <article key={person.name} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
            <Avatar label={person.name} size="lg" image={person.image} />
            <h3 className="mt-3 font-black">{person.name}</h3>
            <p className="text-sm text-slate-500">{person.role}</p>
            <button className="secondary-button mx-auto mt-4" type="button">Message</button>
          </article>
        ))}
      </div>
    </div>
  );
}

function AreaScreen() {
  return (
    <div className="space-y-7">
      <section className="relative">
        <BadlapurMapArt />
        <div className="absolute left-5 top-5 rounded-2xl bg-white/85 p-4 shadow-lg backdrop-blur">
          <p className="text-sm font-bold">You are in</p>
          <h1 className="mt-1 text-3xl font-black text-emerald-700">Badlapur</h1>
          <p className="text-sm text-slate-500">Thane, Maharashtra</p>
          <div className="mt-5 grid gap-3">
            <MiniStat label="Local Community" value="25.4K+" />
            <MiniStat label="Active Groups" value="128" />
            <MiniStat label="Live Alerts" value="7" danger />
          </div>
        </div>
      </section>
      <SectionHeader title="Your Localities" action="Manage" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {localities.map((locality, index) => (
          <button key={locality.name} className={`tap-card min-h-36 flex-col gap-3 p-4 ${index === 0 ? "border-emerald-700 bg-emerald-50" : ""}`} type="button">
            <Home className={`size-8 ${index === 0 ? "text-emerald-700" : "text-slate-500"}`} />
            <span className="text-center font-bold">{locality.name}</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm">{locality.status}</span>
          </button>
        ))}
        <button className="tap-card min-h-36 flex-col gap-3 p-4" type="button">
          <Plus className="size-8 rounded-lg border border-dashed border-emerald-700 p-1 text-emerald-700" />
          <span className="font-bold">Add Locality</span>
        </button>
      </div>
      <SectionHeader title="Area Insights" action="This Week" />
      <div className="grid grid-cols-2 rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid-cols-4">
        {insights.map((item) => (
          <div key={item.label} className="border-slate-100 p-4 text-center sm:border-r sm:last:border-r-0">
            <item.icon className={`mx-auto size-7 ${item.tone}`} />
            <p className="mt-3 text-sm font-semibold">{item.label}</p>
            <p className="mt-1 text-3xl font-black">{item.count}</p>
            <p className="mt-1 text-sm font-bold text-emerald-700">↑ {item.label === "Businesses" ? "6" : item.label === "Active Users" ? "8" : item.label === "New Posts" ? "12" : "15"}%</p>
          </div>
        ))}
      </div>
      <SectionHeader title="Nearby Essentials" action="View All" />
      <IconGrid items={essentials} columns="grid-cols-2 sm:grid-cols-5" showCount />
      <SectionHeader title="Recent Area Alerts" action="View All" />
      <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {areaAlerts.map((alert, index) => (
            <div key={alert.title} className={`flex items-center gap-4 p-4 ${index > 0 ? "border-t border-slate-100" : ""}`}>
              <span className={`grid size-12 place-items-center rounded-2xl ${alert.tone}`}>
                <alert.icon className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold leading-5">{alert.title}</p>
                <p className="mt-1 text-sm text-slate-500">{alert.source} · {alert.time}</p>
              </div>
              <ChevronRight className="size-5 text-slate-500" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50 p-5">
          <h3 className="text-xl font-black">Stay updated about <span className="text-emerald-700">Badlapur</span></h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Enable notifications to receive important updates and alerts.</p>
          <button className="primary-button mt-5 w-full justify-center" type="button">
            <Bell className="size-5" />
            Manage Notifications
          </button>
        </div>
      </div>
    </div>
  );
}

function IconGrid({ items, columns, showCount = false }: { items: typeof quickActions; columns: string; showCount?: boolean }) {
  return (
    <div className={`grid ${columns} gap-3`}>
      {items.map((item) => (
        <button key={item.label} type="button" className="tap-card min-h-28 flex-col gap-3 p-3 text-center">
          <span className={`grid size-14 place-items-center rounded-2xl ${item.tone}`}>
            <item.icon className="size-7" />
          </span>
          <span className="text-sm font-bold leading-tight">{item.label}</span>
          {showCount && <span className="text-sm font-black text-emerald-700">{item.count}</span>}
          {!showCount && item.count && <span className="text-2xl font-black">{item.count}</span>}
        </button>
      ))}
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-2xl font-black tracking-normal">{title}</h2>
      {action && <button className="text-sm font-black text-emerald-700 transition hover:text-emerald-900" type="button">{action}</button>}
    </div>
  );
}

function GroupCard({ group, joined = false }: { group: (typeof yourGroups)[number] | (typeof exploreGroups)[number]; joined?: boolean }) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Avatar label={group.name} size="lg" image={group.image} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-black">{group.name}</h3>
          {"role" in group && <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{group.role}</span>}
        </div>
        <p className="text-sm text-slate-600">{group.category} · {group.members} Members</p>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-700">{group.description}</p>
      </div>
      {joined && "newCount" in group ? (
        <div className="text-right">
          <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{group.newCount}</span>
          <p className="mt-3 text-sm text-slate-500">{group.time}</p>
        </div>
      ) : (
        <button className="secondary-button" type="button">Join</button>
      )}
    </article>
  );
}

function PostList({ limit }: { limit?: number }) {
  return (
    <div className="space-y-4">
      {recentPosts.slice(0, limit).map((post) => (
        <article key={post.text} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Avatar label={post.avatar} image="person" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-black">{post.author}</h3>
                <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{post.role}</span>
              </div>
              <p className="text-sm text-slate-500">{post.location} · {post.time}</p>
            </div>
            <MoreHorizontal className="size-5 text-slate-500" />
          </div>
          <p className="mt-4 text-base leading-7">{post.text}</p>
          {post.image && <div className="mt-4"><SunsetStrip /></div>}
          {post.attachment && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4">
              <MegaphoneIcon />
              <div>
                <p className="font-black">Announcement</p>
                <p className="text-sm text-slate-600">{post.attachment}</p>
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-600">
            <button className="flex items-center gap-2 transition hover:text-emerald-700" type="button"><ThumbsUp className="size-5" /> {post.likes}</button>
            <button className="flex items-center gap-2 transition hover:text-emerald-700" type="button"><MessageCircle className="size-5" /> {post.comments} Comments</button>
            <button className="flex items-center gap-2 transition hover:text-emerald-700" type="button"><Share2 className="size-5" /> Share</button>
            <button className="transition hover:text-emerald-700" type="button"><Image className="size-5" /></button>
          </div>
        </article>
      ))}
    </div>
  );
}

function MegaphoneIcon() {
  return (
    <span className="grid size-12 place-items-center rounded-2xl bg-white text-emerald-700">
      <Bell className="size-6" />
    </span>
  );
}

function ChatList({ title, chats, action, pinned = false }: { title: string; chats: typeof recentChats; action?: string; pinned?: boolean }) {
  return (
    <section>
      <SectionHeader title={title} action={action} />
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        {chats.map((chat, index) => (
          <div key={chat.name} className={`flex items-center gap-4 p-4 ${index > 0 ? "border-t border-slate-100" : ""}`}>
            {pinned && <span className="hidden text-emerald-700 sm:block">●</span>}
            <Avatar label={chat.name} image={chat.image} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-black">{chat.name}</h3>
                <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{chat.label}</span>
              </div>
              <p className="truncate text-sm text-slate-600">{chat.message}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">{chat.time}</p>
              {chat.unread && <span className="mt-2 inline-grid size-6 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white">{chat.unread}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MiniStat({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`grid size-10 place-items-center rounded-xl ${danger ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-700"}`}>
        {danger ? <Bell className="size-5" /> : <Users className="size-5" />}
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-600">{label}</p>
        <p className={`text-xl font-black ${danger ? "text-orange-600" : "text-emerald-700"}`}>{value}</p>
      </div>
    </div>
  );
}

function Avatar({ label, size = "md", image }: { label: string; size?: "md" | "lg"; image?: string }) {
  const initials = label.split(" ").map((part) => part[0]).join("").slice(0, 2);
  const sizeClass = size === "lg" ? "size-16" : "size-12";
  const palette =
    image === "temple" ? "from-amber-300 to-orange-700" :
    image === "traffic" ? "from-slate-300 to-slate-700" :
    image === "store" ? "from-red-300 to-amber-700" :
    image === "school" ? "from-orange-200 to-emerald-700" :
    image === "sports" ? "from-sky-300 to-emerald-700" :
    image === "books" ? "from-amber-100 to-slate-500" :
    image === "nature" ? "from-lime-200 to-emerald-700" :
    "from-emerald-100 to-emerald-700";

  return (
    <div className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br ${palette} ${sizeClass} text-sm font-black text-white shadow-inner`}>
      {image?.startsWith("person") ? <UserRound className="size-7" /> : initials}
    </div>
  );
}

function BottomNavigation({ activeTab, onChange }: { activeTab: NavTab; onChange: (tab: NavTab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-4 z-20 mx-auto w-[min(92vw,820px)] rounded-[2rem] border border-slate-200 bg-white/95 px-3 py-3 shadow-2xl shadow-slate-900/15 backdrop-blur">
      <div className="grid grid-cols-5 items-end gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isPost = item.id === "post";
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-bold transition active:scale-95 ${
                isActive ? "text-emerald-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span
                className={
                  isPost
                    ? "mb-1 grid size-14 -translate-y-5 place-items-center rounded-full bg-gradient-to-br from-emerald-700 to-emerald-500 text-white shadow-xl shadow-emerald-900/25"
                    : "relative"
                }
              >
                <item.icon className={isPost ? "size-8" : "size-7"} strokeWidth={isActive ? 2.8 : 2.2} />
                {item.id === "chats" && (
                  <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-red-500 text-[11px] text-white">2</span>
                )}
              </span>
              <span className={isPost ? "-mt-5" : ""}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
