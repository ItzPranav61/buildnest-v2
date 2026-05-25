import {
  BellRing,
  CalendarDays,
  Car,
  CircleEllipsis,
  ClipboardList,
  HelpCircle,
  Home,
  MapPin,
  MessageCircle,
  Plus,
  Store,
  Tag,
  UsersRound,
  Wrench
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavId = "home" | "groups" | "post" | "chats" | "area";

export type ActionItem = {
  label: string;
  icon: LucideIcon;
  tone: string;
};

export const navItems: { id: NavId; label: string; icon: LucideIcon; badge?: string }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "groups", label: "Groups", icon: UsersRound },
  { id: "post", label: "Post", icon: Plus },
  { id: "chats", label: "Chats", icon: MessageCircle, badge: "2" },
  { id: "area", label: "My Area", icon: MapPin }
];

export const quickActions: ActionItem[] = [
  { label: "Local Feed", icon: ClipboardList, tone: "text-[#07864f] bg-[#eefaf3]" },
  { label: "Alerts", icon: BellRing, tone: "text-[#e23d3d] bg-[#fff1f1]" },
  { label: "Events", icon: CalendarDays, tone: "text-[#7b49e6] bg-[#f5efff]" },
  { label: "Lost & Found", icon: HelpCircle, tone: "text-[#2b73d6] bg-[#f0f6ff]" },
  { label: "Near By People", icon: UsersRound, tone: "text-[#df5d00] bg-[#fff3e9]" },
  { label: "Businesses", icon: Store, tone: "text-[#cf6900] bg-[#fff4e7]" },
  { label: "Buy & Sell", icon: Tag, tone: "text-[#07864f] bg-[#effbf4]" },
  { label: "Services", icon: Wrench, tone: "text-[#2c78cf] bg-[#eef6ff]" },
  { label: "Polls", icon: ClipboardList, tone: "text-[#8a55e7] bg-[#f5f0ff]" },
  { label: "More", icon: CircleEllipsis, tone: "text-[#5d646d] bg-[#f7f7f7]" }
];

export const happeningCards = [
  {
    tag: "Announcement",
    title: "Water Supply Maintenance",
    body: "Water supply will be affected in some areas on May 22 from 10 PM to 6 AM.",
    meta: "Badlapur Municipal Council",
    time: "2h ago",
    icon: BellRing,
    tone: "text-[#07864f]",
    tagTone: "bg-[#e8f8ee] text-[#07864f]"
  },
  {
    tag: "Traffic Update",
    title: "Slow Traffic on Murbad Road",
    body: "Heavy traffic near Kulgaon Naka. Please plan your commute.",
    meta: "",
    time: "3h ago",
    icon: Car,
    tone: "text-[#4d8b1f]",
    tagTone: "bg-[#fff2db] text-[#c86600]"
  },
  {
    tag: "Community",
    title: "Tree Plantation Drive",
    body: "Join us this Sunday at 7 AM near Badlapur Station.",
    meta: "",
    time: "5h ago",
    icon: UsersRound,
    tone: "text-[#4b9c21]",
    tagTone: "bg-[#f3eafe] text-[#834ee8]"
  }
];

export const recentPost = {
  author: "Neha Patil",
  role: "Local Resident",
  location: "Kulgaon",
  time: "1h ago",
  text: "Beautiful sunset view from Kulgaon hills today! 🌇",
  tag: "#BadlapurDiaries"
};
