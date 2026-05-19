import {
  AlertTriangle,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Car,
  CircleHelp,
  ClipboardList,
  Fuel,
  HeartHandshake,
  Hospital,
  Image,
  Landmark,
  MapPin,
  Megaphone,
  MessageCircle,
  MessageSquareText,
  PackageSearch,
  PencilLine,
  School,
  Search,
  Shield,
  ShoppingBag,
  Store,
  Tag,
  TreePine,
  Users,
  Video
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavTab = "home" | "groups" | "post" | "chats" | "area";

export type IconItem = {
  label: string;
  icon: LucideIcon;
  tone: string;
  count?: string;
};

export const quickActions: IconItem[] = [
  { label: "Local Feed", icon: ClipboardList, tone: "text-emerald-700 bg-emerald-50" },
  { label: "Alerts", icon: Bell, tone: "text-red-600 bg-red-50" },
  { label: "Events", icon: CalendarDays, tone: "text-violet-600 bg-violet-50" },
  { label: "Lost & Found", icon: PackageSearch, tone: "text-blue-600 bg-blue-50" },
  { label: "Nearby People", icon: Users, tone: "text-orange-600 bg-orange-50" },
  { label: "Businesses", icon: Store, tone: "text-amber-700 bg-amber-50" },
  { label: "Buy & Sell", icon: Tag, tone: "text-emerald-700 bg-emerald-50" },
  { label: "Services", icon: BriefcaseBusiness, tone: "text-sky-600 bg-sky-50" },
  { label: "Polls", icon: MessageSquareText, tone: "text-purple-600 bg-purple-50" }
];

export const happeningCards = [
  {
    tag: "Announcement",
    title: "Water Supply Maintenance",
    body: "Water supply will be affected in some areas on May 22 from 10 PM to 6 AM.",
    source: "Badlapur Municipal Council",
    time: "2h ago",
    icon: Megaphone,
    tone: "text-emerald-700 bg-emerald-50"
  },
  {
    tag: "Traffic Update",
    title: "Slow Traffic on Murbad Road",
    body: "Heavy traffic near Kulgaon Naka. Please plan your commute.",
    source: "Traffic Volunteers",
    time: "3h ago",
    icon: Car,
    tone: "text-orange-600 bg-orange-50"
  },
  {
    tag: "Community",
    title: "Tree Plantation Drive",
    body: "Join us this Sunday at 7 AM near Badlapur Station.",
    source: "Shiv Mandir Group",
    time: "5h ago",
    icon: TreePine,
    tone: "text-green-700 bg-green-50"
  }
];

export const recentPosts = [
  {
    author: "Neha Patil",
    role: "Local Resident",
    location: "Kulgaon",
    time: "1h ago",
    avatar: "NP",
    text: "Beautiful sunset view from Kulgaon hills today! #BadlapurDiaries",
    image: "sunset",
    likes: 56,
    comments: 12
  },
  {
    author: "Rohit Sharma",
    role: "Admin",
    location: "Badlapur West Residents",
    time: "2h ago",
    avatar: "RS",
    text: "Water supply maintenance in some areas on May 22 from 10 PM to 6 AM. Please store water in advance and cooperate.",
    attachment: "Announcement from Badlapur Municipal Council",
    likes: 34,
    comments: 8
  }
];

export const groupCategories: IconItem[] = [
  { label: "All Groups", icon: Users, tone: "text-emerald-700 bg-emerald-50", count: "32" },
  { label: "Locality", icon: Building2, tone: "text-slate-600 bg-white", count: "12" },
  { label: "Interests", icon: HeartHandshake, tone: "text-slate-600 bg-white", count: "8" },
  { label: "Support", icon: Shield, tone: "text-slate-600 bg-white", count: "6" },
  { label: "Events", icon: CalendarDays, tone: "text-slate-600 bg-white", count: "6" }
];

export const yourGroups = [
  {
    name: "Badlapur West Residents",
    category: "Society",
    members: 256,
    role: "Admin",
    image: "society",
    description: "Official group for Badlapur West residents to share updates and announcements.",
    newCount: "2 new",
    time: "10m ago"
  },
  {
    name: "Shiv Mandir Badlapur",
    category: "Community",
    members: 187,
    role: "Admin",
    image: "temple",
    description: "For temple updates, events and volunteer coordination.",
    newCount: "1 new",
    time: "1h ago"
  },
  {
    name: "Badlapur Sports Club",
    category: "Sports",
    members: 143,
    role: "Member",
    image: "sports",
    description: "For sports lovers. Join matches, trainings and tournaments.",
    newCount: "3 new",
    time: "3h ago"
  }
];

export const exploreGroups = [
  {
    name: "Students Hub Badlapur",
    category: "Education",
    members: 212,
    image: "books",
    description: "A space for students to share notes, updates and more."
  },
  {
    name: "Badlapur Traffic Updates",
    category: "Public",
    members: 321,
    image: "traffic",
    description: "Real-time traffic updates and road information."
  },
  {
    name: "Badlapur Nature Walkers",
    category: "Nature",
    members: 98,
    image: "nature",
    description: "Explore trails, hills and green corners around Badlapur."
  }
];

export const postOptions: IconItem[] = [
  { label: "Photo", icon: Image, tone: "text-emerald-700 bg-emerald-50" },
  { label: "Video", icon: Video, tone: "text-blue-600 bg-blue-50" },
  { label: "Poll", icon: MessageSquareText, tone: "text-purple-600 bg-purple-50" },
  { label: "Event", icon: CalendarDays, tone: "text-violet-600 bg-violet-50" },
  { label: "Location", icon: MapPin, tone: "text-emerald-700 bg-emerald-50" },
  { label: "Alert", icon: AlertTriangle, tone: "text-orange-600 bg-orange-50" },
  { label: "Announcement", icon: Megaphone, tone: "text-emerald-700 bg-emerald-50" },
  { label: "For Sale / Wanted", icon: Tag, tone: "text-pink-600 bg-pink-50" }
];

export const chatTabs = ["All Chats", "Groups", "Direct", "Announcements", "Requests"];

export const pinnedChats = [
  {
    name: "Badlapur West Residents",
    label: "Group",
    message: "Rohit: Water supply update for Phase 2 area.",
    time: "9:30 AM",
    unread: 5,
    image: "society"
  },
  {
    name: "Shiv Mandir Badlapur",
    label: "Group",
    message: "Pooja: Aarti timings this Sunday.",
    time: "8:45 AM",
    unread: 2,
    image: "temple"
  }
];

export const recentChats = [
  {
    name: "Neha Patil",
    label: "Local Resident",
    message: "Hey! Are you joining the tree plantation drive?",
    time: "10:15 AM",
    unread: 1,
    image: "person"
  },
  {
    name: "Patil General Store",
    label: "Business",
    message: "Thank you for shopping with us!",
    time: "Yesterday",
    unread: 1,
    image: "store"
  },
  {
    name: "Badlapur Traffic Updates",
    label: "Group",
    message: "Admin: Slow traffic near Kulgaon naka.",
    time: "Yesterday",
    unread: 3,
    image: "traffic"
  },
  {
    name: "Amit Verma",
    label: "Local Resident",
    message: "If anyone found a black wallet near station, please let me know.",
    time: "Tue",
    image: "person2"
  },
  {
    name: "St. Anthony's School, Badlapur",
    label: "Business",
    message: "Notice: Parent meeting on Saturday at 10 AM.",
    time: "Mon",
    image: "school"
  }
];

export const peopleYouMayKnow = [
  { name: "Pallavi Jadhav", role: "Local Resident", image: "person" },
  { name: "Sagar More", role: "Local Resident", image: "person2" },
  { name: "Ritika Singh", role: "Local Resident", image: "person3" }
];

export const localities = [
  { name: "Badlapur West", status: "Primary" },
  { name: "Badlapur East", status: "Added" },
  { name: "Kulgaon", status: "Added" },
  { name: "Rameshwadi", status: "Added" }
];

export const insights: IconItem[] = [
  { label: "New Posts", icon: ClipboardList, tone: "text-emerald-700", count: "186" },
  { label: "Active Users", icon: Users, tone: "text-blue-600", count: "2.1K" },
  { label: "Replies", icon: MessageCircle, tone: "text-orange-600", count: "342" },
  { label: "Businesses", icon: Store, tone: "text-violet-600", count: "215" }
];

export const essentials: IconItem[] = [
  { label: "Hospitals", icon: Hospital, tone: "text-red-600", count: "12" },
  { label: "Schools", icon: School, tone: "text-blue-600", count: "18" },
  { label: "Police Stations", icon: Shield, tone: "text-violet-600", count: "2" },
  { label: "ATMs", icon: Landmark, tone: "text-emerald-700", count: "24" },
  { label: "Petrol Pumps", icon: Fuel, tone: "text-orange-600", count: "6" }
];

export const areaAlerts = [
  {
    title: "Water supply maintenance in some areas on May 22 from 10 PM to 6 AM.",
    source: "Badlapur Municipal Council",
    time: "2h ago",
    icon: AlertTriangle,
    tone: "text-orange-600 bg-orange-50"
  },
  {
    title: "Tree plantation drive this Sunday at 7 AM near Badlapur Station.",
    source: "Shiv Mandir Group",
    time: "5h ago",
    icon: TreePine,
    tone: "text-green-700 bg-green-50"
  }
];

export const searchHints = [
  { label: "Search local updates", icon: Search },
  { label: "Badlapur alerts", icon: AlertTriangle },
  { label: "Nearby services", icon: Store },
  { label: "Community polls", icon: CircleHelp },
  { label: "Report issue", icon: PencilLine },
  { label: "Buy and sell", icon: ShoppingBag }
];
