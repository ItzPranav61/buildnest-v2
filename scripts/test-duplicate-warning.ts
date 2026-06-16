import assert from "node:assert/strict";
import { findPossibleDuplicateOpportunities } from "../lib/opportunity-duplicates";

const existingRows = [
  {
    id: "same-title-org",
    title: "Google Summer of Code",
    organization: "Google Open Source",
    external_link: "https://summerofcode.withgoogle.com",
    review_status: "approved"
  },
  {
    id: "same-link",
    title: "Different Program Name",
    organization: "Different Org",
    external_link: "https://example.com/apply",
    review_status: "approved"
  },
  {
    id: "similar-category",
    title: "Frontend Builder Internship",
    organization: "BuildNest Labs",
    external_link: null,
    review_status: "approved"
  }
];

const sameTitleAndOrganization = findPossibleDuplicateOpportunities(
  {
    title: "  google summer   of code ",
    organization: "Google Open Source",
    external_link: null
  },
  existingRows
);

assert.equal(sameTitleAndOrganization.length, 1);
assert.equal(sameTitleAndOrganization[0].matchedBy, "title_organization");
assert.equal(sameTitleAndOrganization[0].row.id, "same-title-org");

const sameExternalLink = findPossibleDuplicateOpportunities(
  {
    title: "New Title",
    organization: "New Org",
    external_link: "https://example.com/apply/"
  },
  existingRows
);

assert.equal(sameExternalLink.length, 1);
assert.equal(sameExternalLink[0].matchedBy, "external_link");
assert.equal(sameExternalLink[0].row.id, "same-link");

const differentOpportunitySimilarCategory = findPossibleDuplicateOpportunities(
  {
    title: "Backend Builder Internship",
    organization: "BuildNest Labs",
    external_link: null
  },
  existingRows
);

assert.equal(differentOpportunitySimilarCategory.length, 0);

const missingDeadlineStillWorks = findPossibleDuplicateOpportunities(
  {
    title: "Google Summer of Code",
    organization: "Google Open Source",
    external_link: null
  },
  existingRows
);

assert.equal(missingDeadlineStillWorks.length, 1);
assert.equal(missingDeadlineStillWorks[0].matchedBy, "title_organization");

console.log("Duplicate warning tests passed.");
