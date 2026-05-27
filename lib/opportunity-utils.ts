import type { Opportunity } from "@/types/opportunity";

function deadlineTime(opportunity: Opportunity) {
  const time = new Date(opportunity.deadline).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

export function sortOpportunitiesByDeadline(opportunities: Opportunity[]) {
  return [...opportunities].sort((a, b) => {
    const aExpired = a.status === "Expired";
    const bExpired = b.status === "Expired";

    if (aExpired !== bExpired) {
      return aExpired ? 1 : -1;
    }

    return deadlineTime(a) - deadlineTime(b);
  });
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
