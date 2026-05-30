"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  FiArchive,
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiCode,
  FiEdit2,
  FiFlag,
  FiRefreshCw,
  FiTrash2,
  FiX
} from "react-icons/fi";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Toast, type ToastState } from "@/components/Toast";
import { createBrowserAuthClient } from "@/lib/auth";
import {
  formatDeadline,
  getStatusBadgeClass,
  isOssCategory,
  isValidExternalLink,
  normalizeExternalLink,
  sortOpportunitiesByDeadline
} from "@/lib/opportunity-utils";
import { supabase } from "@/lib/supabase";
import type { Opportunity, OpportunityInsert, ReviewStatus } from "@/types/opportunity";

const statuses = ["Open", "Upcoming", "Expired"] as const;
const reviewTabs: { label: string; value: ReviewStatus }[] = [
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" }
];
const selectFields =
  "id, title, organization, category, status, description, location, tags, deadline, external_link, source_url, source_name, scraped_at, review_status, is_automated";
const requiredFields = ["title", "organization", "category", "status"] as const;

type FieldErrors = Partial<Record<(typeof requiredFields)[number] | "external_link", string>>;

const emptyOpportunity: Opportunity = {
  id: "",
  title: "",
  organization: "",
  category: "",
  status: "Open",
  description: "",
  location: "",
  tags: [],
  deadline: null,
  external_link: null,
  source_url: null,
  source_name: null,
  scraped_at: null,
  review_status: "approved",
  is_automated: false
};

function parseTagsInput(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function DashboardOpportunityManager() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [deletingOpportunity, setDeletingOpportunity] = useState<Opportunity | null>(null);
  const [formState, setFormState] = useState<Opportunity>(emptyOpportunity);
  const [tagsInput, setTagsInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [activeReviewStatus, setActiveReviewStatus] = useState<ReviewStatus>("approved");
  const visibleOpportunities = useMemo(
    () => opportunities.filter((opportunity) => opportunity.review_status === activeReviewStatus),
    [activeReviewStatus, opportunities]
  );

  const metrics = useMemo(
    () => [
      { label: "Approved", value: opportunities.filter((opportunity) => opportunity.review_status === "approved").length, icon: FiCheckCircle },
      { label: "Pending review", value: opportunities.filter((opportunity) => opportunity.review_status === "pending").length, icon: FiClock },
      { label: "Rejected", value: opportunities.filter((opportunity) => opportunity.review_status === "rejected").length, icon: FiArchive },
      { label: "Total records", value: opportunities.length, icon: FiBriefcase }
    ],
    [opportunities]
  );
  const quickStats = useMemo(
    () => [
      {
        label: "Internship tracks",
        value: opportunities.filter((opportunity) => opportunity.category === "Internship").length,
        icon: FiBriefcase
      },
      {
        label: "Build sprints",
        value: opportunities.filter((opportunity) => opportunity.category === "Hackathon").length,
        icon: FiCode
      },
      {
        label: "Fellowship paths",
        value: opportunities.filter((opportunity) => opportunity.category === "Fellowship").length,
        icon: FiBookOpen
      },
      {
        label: "Builder tracks",
        value: opportunities.filter((opportunity) => isOssCategory(opportunity.category)).length,
        icon: FiFlag
      }
    ],
    [opportunities]
  );
  const nearestDeadlineOpportunity = visibleOpportunities[0] ?? null;
  const newestOpportunityInView = visibleOpportunities[visibleOpportunities.length - 1] ?? null;

  async function fetchOpportunities(options: { showRefreshing?: boolean } = {}) {
    if (options.showRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("opportunities")
      .select(selectFields)
      .in("review_status", ["approved", "pending", "rejected"]);

    if (fetchError) {
      setError(fetchError.message);
      setOpportunities([]);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    const normalizedOpportunities = (data ?? []).map((opportunity) => ({
        ...opportunity,
        tags: Array.isArray(opportunity.tags) ? opportunity.tags : []
      })) as Opportunity[];

    setOpportunities(sortOpportunitiesByDeadline(normalizedOpportunities));
    setIsLoading(false);
    setIsRefreshing(false);
  }

  useEffect(() => {
    fetchOpportunities();
  }, []);

  function openEditModal(opportunity: Opportunity) {
    setEditingOpportunity(opportunity);
    setFormState(opportunity);
    setTagsInput(opportunity.tags.join(", "));
    setError(null);
    setFieldErrors({});
  }

  function closeEditModal() {
    setEditingOpportunity(null);
    setFormState(emptyOpportunity);
    setTagsInput("");
    setFieldErrors({});
    setIsSaving(false);
  }

  function clearFieldError(name: keyof FieldErrors) {
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

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingOpportunity) {
      return;
    }

    if (!editingOpportunity.id) {
      setError("Unable to update opportunity: missing row id.");
      setToast({ type: "error", message: "Update failed" });
      return;
    }

    setIsSaving(true);
    setError(null);
    setFieldErrors({});
    const externalLink = normalizeExternalLink(formState.external_link ?? "");
    const nextFieldErrors: FieldErrors = {};

    requiredFields.forEach((field) => {
      if (String(formState[field] ?? "").trim() === "") {
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
      setToast({ type: "error", message: "Update failed" });
      setIsSaving(false);
      focusField(event.currentTarget, firstInvalidField);
      return;
    }

    const payload: OpportunityInsert = {
      title: formState.title.trim(),
      organization: formState.organization.trim(),
      category: formState.category.trim(),
      status: formState.status,
      description: formState.description.trim(),
      location: formState.location.trim(),
      tags: parseTagsInput(tagsInput),
      deadline: formState.deadline?.trim() || null,
      external_link: externalLink,
      review_status: formState.review_status,
      is_automated: formState.is_automated,
      source_url: formState.source_url,
      source_name: formState.source_name,
      scraped_at: formState.scraped_at
    };

    const supabase = createBrowserAuthClient();
    const { data: updatedRows, error: updateError } = await supabase
      .from("opportunities")
      .update(payload)
      .eq("id", editingOpportunity.id)
      .select(selectFields);

    if (updateError) {
      setError(updateError.message);
      setToast({ type: "error", message: "Update failed" });
      setIsSaving(false);
      return;
    }

    if (!updatedRows || updatedRows.length === 0) {
      setError(
        "Update did not change any rows. Check that this opportunity id exists and that Supabase RLS allows authenticated updates."
      );
      setToast({ type: "error", message: "Update failed" });
      setIsSaving(false);
      return;
    }

    const updatedOpportunity = {
      ...updatedRows[0],
      tags: Array.isArray(updatedRows[0].tags) ? updatedRows[0].tags : []
    } as Opportunity;

    setOpportunities((current) =>
      sortOpportunitiesByDeadline(
        current.map((opportunity) => (opportunity.id === editingOpportunity.id ? updatedOpportunity : opportunity))
      )
    );

    closeEditModal();
    setToast({ type: "success", message: "Opportunity updated" });
    await fetchOpportunities();
  }

  async function confirmDelete() {
    if (!deletingOpportunity) {
      return;
    }

    if (!deletingOpportunity.id) {
      setError("Unable to delete opportunity: missing row id.");
      setToast({ type: "error", message: "Delete failed" });
      return;
    }

    setIsSaving(true);
    setError(null);

    const supabase = createBrowserAuthClient();
    const { error: deleteError } = await supabase.from("opportunities").delete().eq("id", deletingOpportunity.id);

    if (deleteError) {
      setError(deleteError.message);
      setToast({ type: "error", message: "Delete failed" });
      setIsSaving(false);
      return;
    }

    setOpportunities((current) => current.filter((opportunity) => opportunity.id !== deletingOpportunity.id));
    setDeletingOpportunity(null);
    setIsSaving(false);
    setToast({ type: "success", message: "Opportunity deleted" });
    await fetchOpportunities();
  }

  async function updateReviewStatus(opportunity: Opportunity, reviewStatus: ReviewStatus) {
    if (!opportunity.id) {
      setError("Unable to update review status: missing row id.");
      setToast({ type: "error", message: "Review update failed" });
      return;
    }

    setIsSaving(true);
    setError(null);

    const supabase = createBrowserAuthClient();
    const { data: updatedRows, error: updateError } = await supabase
      .from("opportunities")
      .update({ review_status: reviewStatus })
      .eq("id", opportunity.id)
      .select(selectFields);

    if (updateError) {
      setError(updateError.message);
      setToast({ type: "error", message: "Review update failed" });
      setIsSaving(false);
      return;
    }

    if (!updatedRows || updatedRows.length === 0) {
      setError("Review status did not update. Check that Supabase RLS allows authenticated updates.");
      setToast({ type: "error", message: "Review update failed" });
      setIsSaving(false);
      return;
    }

    const updatedOpportunity = {
      ...updatedRows[0],
      tags: Array.isArray(updatedRows[0].tags) ? updatedRows[0].tags : []
    } as Opportunity;

    setOpportunities((current) =>
      sortOpportunitiesByDeadline(
        current.map((currentOpportunity) =>
          currentOpportunity.id === opportunity.id ? updatedOpportunity : currentOpportunity
        )
      )
    );
    setToast({
      type: "success",
      message: reviewStatus === "approved" ? "Opportunity approved" : "Opportunity rejected"
    });
    setIsSaving(false);
    await fetchOpportunities();
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="mt-8 grid w-full max-w-full min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item) => (
          <div key={item.label} className="w-full max-w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl shadow-black/10 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/40 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="min-w-0 break-words text-sm font-semibold text-slate-400">{item.label}</span>
              <span className="grid size-10 place-items-center rounded-lg bg-cyan-300/15 text-cyan-200">
                <item.icon aria-hidden />
              </span>
            </div>
            <p className="mt-4 text-3xl font-black">{isLoading ? "..." : item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid w-full max-w-full min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((item) => (
          <div key={item.label} className="w-full max-w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl shadow-black/10 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/40 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="min-w-0 break-words text-sm font-semibold text-slate-400">{item.label}</span>
              <span className="grid size-10 place-items-center rounded-lg bg-cyan-300/15 text-cyan-200">
                <item.icon aria-hidden />
              </span>
            </div>
            <p className="mt-4 text-3xl font-black">{isLoading ? "..." : item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid w-full max-w-full min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        <section className="w-full max-w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl shadow-black/10 backdrop-blur sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Manage opportunities</h2>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                {isLoading ? "Loading" : visibleOpportunities.length} {activeReviewStatus} listings
              </p>
            </div>
            <button
              type="button"
              onClick={() => fetchOpportunities({ showRefreshing: true })}
              disabled={isRefreshing}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white transition duration-200 hover:border-cyan-300/40 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:text-slate-500"
            >
              <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} aria-hidden />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm font-semibold text-red-200">{error}</div>
          ) : null}

          <div className="mt-5 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2 min-[520px]:grid-cols-3">
            {reviewTabs.map((tab) => {
              const count = opportunities.filter((opportunity) => opportunity.review_status === tab.value).length;
              const isActive = activeReviewStatus === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveReviewStatus(tab.value)}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-black transition duration-200 ${
                    isActive
                      ? "bg-cyan-300 text-slate-950"
                      : "border border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white"
                  }`}
                >
                  {tab.label}
                  <span className={`rounded-md px-2 py-0.5 text-xs ${isActive ? "bg-slate-950/10" : "bg-white/10"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="mt-5 grid w-full max-w-full min-w-0 gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-52 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
              ))}
            </div>
          ) : visibleOpportunities.length === 0 ? (
            <div className="mt-5 w-full max-w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center sm:p-10">
              <h3 className="text-lg font-black text-white">No {activeReviewStatus} opportunities</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                Opportunities in this review state will appear here for authenticated admins.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid w-full max-w-full min-w-0 gap-4 md:grid-cols-2">
              {visibleOpportunities.map((opportunity, index) => (
                <article
                  key={`${opportunity.title}-${opportunity.organization}-${opportunity.deadline}-${index}`}
                  className="w-full max-w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/40 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold uppercase tracking-[0.14em] text-cyan-300">{opportunity.category}</p>
                      <h3 className="mt-2 break-words text-lg font-black leading-6 text-white">{opportunity.title}</h3>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-400">{opportunity.organization}</p>
                    </div>
                    <span className={`shrink-0 rounded-md px-3 py-1 text-xs font-black ${getStatusBadgeClass(opportunity.status)}`}>
                      {opportunity.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-black capitalize text-slate-300">
                      {opportunity.review_status}
                    </span>
                    {opportunity.is_automated ? (
                      <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">
                        Automated
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{opportunity.description}</p>

                  {opportunity.source_url ? (
                    <p className="mt-3 break-words text-xs font-semibold text-slate-500">
                      Source: {opportunity.source_name ? `${opportunity.source_name} - ` : ""}
                      {opportunity.source_url}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {opportunity.tags.map((tag) => (
                      <span key={tag} className="max-w-full break-words rounded-md border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex min-w-0 flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="min-w-0 break-words text-sm font-semibold text-slate-400">
                      {opportunity.location} - {formatDeadline(opportunity.deadline)}
                    </p>
                    <div className="grid min-w-0 grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:flex sm:flex-wrap">
                      {opportunity.review_status === "pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => updateReviewStatus(opportunity, "approved")}
                            disabled={isSaving}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100 transition duration-200 hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <FiCheckCircle aria-hidden />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => updateReviewStatus(opportunity, "rejected")}
                            disabled={isSaving}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-200 transition duration-200 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <FiX aria-hidden />
                            Reject
                          </button>
                        </>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => openEditModal(opportunity)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-white transition duration-200 hover:border-cyan-300/40 hover:bg-cyan-300/10"
                      >
                        <FiEdit2 aria-hidden />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingOpportunity(opportunity)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-200 transition duration-200 hover:bg-red-500/15"
                      >
                        <FiTrash2 aria-hidden />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-black text-white">Nearest deadline</h2>
          {isLoading ? (
            <div className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] shadow-sm" />
          ) : nearestDeadlineOpportunity ? (
            <OpportunityCard opportunity={nearestDeadlineOpportunity} />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-sm">
              <h3 className="text-lg font-black text-white">No deadline to show</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Add an opportunity to populate this panel.</p>
            </div>
          )}

          <h2 className="mb-4 mt-6 text-xl font-black text-white">Newest in view</h2>
          {isLoading ? (
            <div className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] shadow-sm" />
          ) : newestOpportunityInView ? (
            <OpportunityCard opportunity={newestOpportunityInView} />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-sm">
              <h3 className="text-lg font-black text-white">No opportunity in view</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Switch review tabs or add an opportunity to populate this panel.</p>
            </div>
          )}
        </section>
      </div>

      {editingOpportunity ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/40 px-4 py-6 sm:px-5">
          <div className="mx-auto my-0 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#07111f] p-5 shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">Edit opportunity</h2>
                <p className="mt-1 text-sm font-semibold text-slate-400">Update live Supabase data.</p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition duration-200 hover:bg-white/10"
                aria-label="Close edit modal"
              >
                <FiX aria-hidden />
              </button>
            </div>

            <form onSubmit={handleUpdate} noValidate className="mt-5 pb-2">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Title", "title", "text"],
                  ["Organization", "organization", "text"],
                  ["Category", "category", "text"],
                  ["Location", "location", "text"],
                  ["Deadline", "deadline", "date"]
                ].map(([label, name, type]) => (
                  <label key={name} className="grid gap-2 text-sm font-bold text-slate-300">
                    {label}
                    <input
                      name={name}
                      type={type}
                      required={requiredFields.includes(name as (typeof requiredFields)[number])}
                      value={String(formState[name as keyof Opportunity] ?? "")}
                      onChange={(event) =>
                        {
                          clearFieldError(name as keyof FieldErrors);
                          setFormState((current) => ({
                            ...current,
                            [name]: name === "deadline" ? event.target.value || null : event.target.value
                          }));
                        }
                      }
                      aria-invalid={Boolean(fieldErrors[name as keyof FieldErrors])}
                      className={`min-h-12 rounded-lg border bg-white/[0.04] px-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-slate-500 focus:ring-4 ${
                        fieldErrors[name as keyof FieldErrors]
                          ? "border-red-400/60 focus:border-red-300 focus:ring-red-300/10"
                          : "border-white/10 focus:border-cyan-300 focus:ring-cyan-300/10"
                      }`}
                    />
                    {fieldErrors[name as keyof FieldErrors] ? (
                      <span className="text-xs font-semibold text-red-200">{fieldErrors[name as keyof FieldErrors]}</span>
                    ) : null}
                  </label>
                ))}
              </div>

              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
                Status
                <select
                  name="status"
                  required
                  value={formState.status}
                  onChange={(event) => {
                    clearFieldError("status");
                    setFormState((current) => ({ ...current, status: event.target.value }));
                  }}
                  aria-invalid={Boolean(fieldErrors.status)}
                  className={`min-h-12 rounded-lg border bg-[#0b1220] px-3 text-sm font-medium text-white outline-none transition duration-200 focus:ring-4 ${
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
                  required
                  value={formState.description}
                  onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                  className="min-h-32 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
                />
              </label>

              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
                External link
                <input
                  name="external_link"
                  type="url"
                  value={formState.external_link ?? ""}
                  onChange={(event) => {
                    clearFieldError("external_link");
                    setFormState((current) => ({ ...current, external_link: event.target.value || null }));
                  }}
                  aria-invalid={Boolean(fieldErrors.external_link)}
                  className={`min-h-12 w-full min-w-0 rounded-lg border bg-white/[0.04] px-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-slate-500 focus:ring-4 ${
                    fieldErrors.external_link ? "border-red-400/60 focus:border-red-300 focus:ring-red-300/10" : "border-white/10 focus:border-cyan-300 focus:ring-cyan-300/10"
                  }`}
                  placeholder="https://example.com/apply"
                />
                {fieldErrors.external_link ? <span className="text-xs font-semibold text-red-200">{fieldErrors.external_link}</span> : null}
              </label>

              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
                Tags
                <input
                  required
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  className="min-h-12 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
                  placeholder="React, Figma, AI"
                />
              </label>

              <div className="mt-6 grid gap-3 sm:flex sm:flex-row">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-300 to-blue-400 px-5 py-3 text-sm font-black text-slate-950 transition duration-200 hover:from-cyan-200 hover:to-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition duration-200 hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deletingOpportunity ? (
        <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-slate-950/40 px-4 py-6 sm:px-5">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#07111f] p-5 shadow-2xl shadow-black/40">
            <h2 className="text-xl font-black text-white">Delete opportunity?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              This will remove <span className="font-bold text-white">{deletingOpportunity.title}</span> from Supabase.
            </p>
            <div className="mt-6 grid gap-3 sm:flex sm:flex-row">
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isSaving}
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {isSaving ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setDeletingOpportunity(null)}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition duration-200 hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
