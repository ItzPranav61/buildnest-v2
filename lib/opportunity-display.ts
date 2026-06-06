import { formatDeadline } from "@/lib/opportunity-utils";
import type { Opportunity } from "@/types/opportunity";

const opportunityDisplayOverrides: Record<
  string,
  {
    posterUrl?: string;
    deadlineLabel?: string;
    locationLabel?: string;
  }
> = {
  "45a4f07d-47fa-4d2d-a118-d131c87f8e61": {
    posterUrl: "/opportunities/codestorm-2026-2-poster.png",
    deadlineLabel: "30 Jun 2026, 11:59 PM IST",
    locationLabel: "Format"
  }
};

function displayOverride(opportunity: Opportunity) {
  return opportunity.id ? opportunityDisplayOverrides[opportunity.id] : undefined;
}

export function getOpportunityDeadlineLabel(opportunity: Opportunity) {
  return opportunity.deadlineLabel ?? displayOverride(opportunity)?.deadlineLabel ?? formatDeadline(opportunity.deadline);
}

export function getOpportunityPosterUrl(opportunity: Opportunity) {
  return opportunity.posterUrl ?? displayOverride(opportunity)?.posterUrl ?? null;
}

export function getOpportunityLocationLabel(opportunity: Opportunity) {
  return opportunity.locationLabel ?? displayOverride(opportunity)?.locationLabel ?? "Location";
}
