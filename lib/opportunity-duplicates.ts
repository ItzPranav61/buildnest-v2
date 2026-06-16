export type DuplicateCheckInput = {
  title: string;
  organization: string;
  external_link: string | null;
};

export type DuplicateCheckRow = DuplicateCheckInput & {
  id?: string | null;
  review_status?: string | null;
};

export type DuplicateMatch = {
  row: DuplicateCheckRow;
  matchedBy: "title_organization" | "external_link";
};

export function normalizeOpportunityDedupeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeOpportunityDedupeUrl(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase().replace(/\/+$/, "");
  return normalized.length > 0 ? normalized : null;
}

export function duplicateCheckSignature(input: DuplicateCheckInput) {
  return [
    normalizeOpportunityDedupeText(input.title),
    normalizeOpportunityDedupeText(input.organization),
    normalizeOpportunityDedupeUrl(input.external_link) ?? ""
  ].join("|");
}

export function findPossibleDuplicateOpportunities(input: DuplicateCheckInput, rows: DuplicateCheckRow[]) {
  const title = normalizeOpportunityDedupeText(input.title);
  const organization = normalizeOpportunityDedupeText(input.organization);
  const externalLink = normalizeOpportunityDedupeUrl(input.external_link);
  const matches: DuplicateMatch[] = [];
  const seenKeys = new Set<string>();

  rows.forEach((row, index) => {
    const rowExternalLink = normalizeOpportunityDedupeUrl(row.external_link);
    const matchedBy =
      externalLink && rowExternalLink === externalLink
        ? "external_link"
        : normalizeOpportunityDedupeText(row.title) === title && normalizeOpportunityDedupeText(row.organization) === organization
          ? "title_organization"
          : null;

    if (!matchedBy) {
      return;
    }

    const key = row.id ?? `${row.title}-${row.organization}-${index}`;
    if (seenKeys.has(key)) {
      return;
    }

    seenKeys.add(key);
    matches.push({ row, matchedBy });
  });

  return matches;
}
