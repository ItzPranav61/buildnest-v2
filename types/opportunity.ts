export type ReviewStatus = "pending" | "approved" | "rejected";

export type Opportunity = {
  id?: string;
  title: string;
  organization: string;
  category: string;
  status: "Open" | "Upcoming" | "Expired" | string;
  description: string;
  location: string;
  tags: string[];
  deadline: string | null;
  external_link: string | null;
  source_url: string | null;
  source_name: string | null;
  scraped_at: string | null;
  review_status: ReviewStatus;
  is_automated: boolean;
};

export type OpportunityInsert = Omit<Opportunity, "id" | "source_url" | "source_name" | "scraped_at"> &
  Partial<Pick<Opportunity, "source_url" | "source_name" | "scraped_at">>;
