"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  duplicateCheckSignature,
  findPossibleDuplicateOpportunities,
  type DuplicateMatch
} from "@/lib/opportunity-duplicates";
import { isValidExternalLink, normalizeExternalLink } from "@/lib/opportunity-utils";
import { supabase } from "@/lib/supabase";
import type { OpportunityInsert } from "@/types/opportunity";

const textFields = [
  { label: "Title", name: "title", placeholder: "Frontend intern", type: "text" },
  { label: "Organization", name: "organization", placeholder: "BuildNest Labs", type: "text" },
  { label: "Category", name: "category", placeholder: "Internship", type: "text" },
  { label: "Location", name: "location", placeholder: "Remote", type: "text" },
  { label: "Deadline", name: "deadline", placeholder: "", type: "date" }
] as const;

const statuses = ["Open", "Upcoming", "Expired"] as const;
const requiredFields = ["title", "organization", "category", "status"] as const;

type FieldErrors = Partial<Record<(typeof requiredFields)[number] | "external_link", string>>;

type DuplicateWarning = {
  signature: string;
  matches: DuplicateMatch[];
};

export function OpportunityForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [duplicateWarning, setDuplicateWarning] = useState<DuplicateWarning | null>(null);

  function clearFieldError(name: keyof FieldErrors) {
    setDuplicateWarning(null);
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function focusField(form: HTMLFormElement, name: string) {
    const field = form.elements.namedItem(name);
    if (field instanceof HTMLElement) {
      field.focus();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const externalLink = normalizeExternalLink(String(formData.get("external_link") ?? ""));
    const nextFieldErrors: FieldErrors = {};

    requiredFields.forEach((field) => {
      if (String(formData.get(field) ?? "").trim() === "") {
        nextFieldErrors[field] = "This field is required.";
      }
    });

    if (!isValidExternalLink(externalLink)) {
      nextFieldErrors.external_link = "Enter a valid URL starting with http:// or https://";
    }

    const firstInvalidField = requiredFields.find((field) => nextFieldErrors[field]) ?? (nextFieldErrors.external_link ? "external_link" : null);

    if (firstInvalidField) {
      setFieldErrors(nextFieldErrors);
      setError("Please fix the highlighted fields.");
      setIsSubmitting(false);
      focusField(event.currentTarget, firstInvalidField);
      return;
    }

    const opportunity: OpportunityInsert = {
      title: String(formData.get("title") ?? "").trim(),
      organization: String(formData.get("organization") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim(),
      status: String(formData.get("status") ?? "Open").trim(),
      description: String(formData.get("description") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      tags: String(formData.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      deadline: String(formData.get("deadline") ?? "").trim() || null,
      external_link: externalLink,
      review_status: "approved",
      is_automated: false
    };

    const signature = duplicateCheckSignature(opportunity);

    if (duplicateWarning?.signature !== signature) {
      const { data: existingRows, error: duplicateError } = await supabase
        .from("opportunities")
        .select("id, title, organization, external_link, review_status");

      if (duplicateError) {
        setError(`Unable to check possible duplicates: ${duplicateError.message}`);
        setIsSubmitting(false);
        return;
      }

      const matches = findPossibleDuplicateOpportunities(opportunity, existingRows ?? []);

      if (matches.length > 0) {
        setDuplicateWarning({ signature, matches });
        setIsSubmitting(false);
        return;
      }
    }

    const { error: insertError } = await supabase.from("opportunities").insert(opportunity);

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/opportunities?created=1");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl shadow-black/10 backdrop-blur sm:p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {textFields.map((field) => (
          <label key={field.label} className="grid gap-2 text-sm font-bold text-slate-300">
            {field.label}
            <input
              name={field.name}
              type={field.type}
              required={requiredFields.includes(field.name as (typeof requiredFields)[number])}
              onChange={() => clearFieldError(field.name as keyof FieldErrors)}
              aria-invalid={Boolean(fieldErrors[field.name as keyof FieldErrors])}
              className={`min-h-12 w-full min-w-0 rounded-lg border bg-white/[0.04] px-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-slate-500 focus:ring-4 ${
                fieldErrors[field.name as keyof FieldErrors]
                  ? "border-red-400/60 focus:border-red-300 focus:ring-red-300/10"
                  : "border-white/10 focus:border-cyan-300 focus:ring-cyan-300/10"
              }`}
              placeholder={field.placeholder}
            />
            {fieldErrors[field.name as keyof FieldErrors] ? (
              <span className="text-xs font-semibold text-red-200">{fieldErrors[field.name as keyof FieldErrors]}</span>
            ) : null}
          </label>
        ))}
      </div>

      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
        Status
        <select
          name="status"
          required
          defaultValue="Open"
          onChange={() => clearFieldError("status")}
          aria-invalid={Boolean(fieldErrors.status)}
          className={`min-h-12 w-full min-w-0 rounded-lg border bg-[#0b1220] px-3 text-sm font-medium text-white outline-none transition duration-200 focus:ring-4 ${
            fieldErrors.status ? "border-red-400/60 focus:border-red-300 focus:ring-red-300/10" : "border-white/10 focus:border-cyan-300 focus:ring-cyan-300/10"
          }`}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {fieldErrors.status ? <span className="text-xs font-semibold text-red-200">{fieldErrors.status}</span> : null}
      </label>

      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
        Description
        <textarea
          name="description"
          required
          onChange={() => setDuplicateWarning(null)}
          className="min-h-32 w-full min-w-0 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
          placeholder="Describe who this is for, what students will build, and what they receive."
        />
      </label>

      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
        Tags
        <input
          name="tags"
          required
          onChange={() => setDuplicateWarning(null)}
          className="min-h-12 w-full min-w-0 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
          placeholder="React, Figma, AI, GitHub"
        />
      </label>

      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
        External link
        <input
          name="external_link"
          type="url"
          onChange={() => clearFieldError("external_link")}
          aria-invalid={Boolean(fieldErrors.external_link)}
          className={`min-h-12 w-full min-w-0 rounded-lg border bg-white/[0.04] px-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-slate-500 focus:ring-4 ${
            fieldErrors.external_link ? "border-red-400/60 focus:border-red-300 focus:ring-red-300/10" : "border-white/10 focus:border-cyan-300 focus:ring-cyan-300/10"
          }`}
          placeholder="https://example.com/apply"
        />
        {fieldErrors.external_link ? <span className="text-xs font-semibold text-red-200">{fieldErrors.external_link}</span> : null}
      </label>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          Unable to add opportunity: {error}
        </div>
      ) : null}

      {duplicateWarning ? (
        <div className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/[0.08] p-4 text-sm font-semibold text-amber-50">
          <p className="font-black">Possible duplicate opportunity</p>
          <p className="mt-2 leading-6 text-amber-100/90">
            This looks similar to an existing opportunity. Review it before saving. You can submit again to save anyway.
          </p>
          <ul className="mt-3 grid gap-2">
            {duplicateWarning.matches.map((match) => (
              <li key={`${match.row.id ?? match.row.title}-${match.matchedBy}`} className="rounded-lg border border-white/10 bg-[#040814]/60 p-3">
                <span className="block break-words font-black text-white">{match.row.title}</span>
                <span className="mt-1 block break-words text-xs text-amber-100/80">
                  {match.row.organization} - matched by {match.matchedBy === "external_link" ? "external link" : "title + organization"}
                  {match.row.review_status ? ` - ${match.row.review_status}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-gradient-to-r from-cyan-300 to-blue-400 px-5 py-3 text-sm font-black text-slate-950 transition duration-200 hover:from-cyan-200 hover:to-blue-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Saving..." : duplicateWarning ? "Save anyway" : "Add opportunity"}
      </button>
    </form>
  );
}
