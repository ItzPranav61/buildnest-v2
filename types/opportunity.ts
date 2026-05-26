export type Opportunity = {
  id?: string;
  title: string;
  organization: string;
  category: string;
  status: "Open" | "Upcoming" | "Expired" | string;
  description: string;
  location: string;
  tags: string[];
  deadline: string;
};

export type OpportunityInsert = Omit<Opportunity, "id">;
