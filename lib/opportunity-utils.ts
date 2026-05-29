import type { Opportunity } from "@/types/opportunity";

function validDeadlineTime(deadline: Opportunity["deadline"]) {
  if (!deadline || deadline.trim() === "" || deadline === "0001-01-01") {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(deadline);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date.getTime();
}

function startOfTodayTime() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

function deadlineSortValue(opportunity: Opportunity) {
  const time = validDeadlineTime(opportunity.deadline);

  if (opportunity.status === "Expired" || (time !== null && time < startOfTodayTime())) {
    return { rank: 2, time: time ?? Number.POSITIVE_INFINITY };
  }

  if (time === null) {
    return { rank: 1, time: Number.POSITIVE_INFINITY };
  }

  return { rank: 0, time };
}

export function sortOpportunitiesByDeadline(opportunities: Opportunity[]) {
  return [...opportunities].sort((a, b) => {
    const aDeadline = deadlineSortValue(a);
    const bDeadline = deadlineSortValue(b);

    if (aDeadline.rank !== bDeadline.rank) {
      return aDeadline.rank - bDeadline.rank;
    }

    return aDeadline.time - bDeadline.time;
  });
}

export function formatDeadline(deadline: Opportunity["deadline"]) {
  const time = validDeadlineTime(deadline);

  if (time === null) {
    return "Rolling";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(time));
}

export function getStatusBadgeClass(status: string) {
  if (status === "Open") {
    return "bg-emerald-400/15 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.18)]";
  }

  if (status === "Upcoming") {
    return "bg-blue-400/15 text-blue-200 shadow-[0_0_20px_rgba(96,165,250,0.18)]";
  }

  if (status === "Expired") {
    return "bg-slate-400/15 text-slate-300";
  }

  return "bg-slate-100 text-slate-700";
}

export function isOssCategory(category: string) {
  const normalized = category.trim().toLowerCase();
  return normalized === "oss" || normalized === "open source" || normalized === "open-source";
}
