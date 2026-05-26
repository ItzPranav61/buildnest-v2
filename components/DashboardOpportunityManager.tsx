"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { FiArchive, FiBriefcase, FiCheckCircle, FiClock, FiEdit2, FiRefreshCw, FiTrash2, FiX } from "react-icons/fi";
import { OpportunityCard } from "@/components/OpportunityCard";
import { createBrowserAuthClient } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Opportunity, OpportunityInsert } from "@/types/opportunity";

const statuses = ["Open", "Upcoming", "Expired"] as const;

const emptyOpportunity: Opportunity = {
  id: "",
  title: "",
  organization: "",
  category: "",
  status: "Open",
  description: "",
  location: "",
  tags: [],
  deadline: ""
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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [deletingOpportunity, setDeletingOpportunity] = useState<Opportunity | null>(null);
  const [formState, setFormState] = useState<Opportunity>(emptyOpportunity);
  const [tagsInput, setTagsInput] = useState("");

  const metrics = useMemo(
    () => [
      { label: "Published", value: opportunities.length, icon: FiBriefcase },
      { label: "Open", value: opportunities.filter((opportunity) => opportunity.status === "Open").length, icon: FiCheckCircle },
      { label: "Upcoming", value: opportunities.filter((opportunity) => opportunity.status === "Upcoming").length, icon: FiClock },
      { label: "Expired", value: opportunities.filter((opportunity) => opportunity.status === "Expired").length, icon: FiArchive }
    ],
    [opportunities]
  );
  const latestOpportunity = opportunities[0] ?? null;

  async function fetchOpportunities() {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("opportunities")
      .select("id, title, organization, category, status, description, location, tags, deadline");

    if (fetchError) {
      setError(fetchError.message);
      setOpportunities([]);
      setIsLoading(false);
      return;
    }

    setOpportunities(
      (data ?? []).map((opportunity) => ({
        ...opportunity,
        tags: Array.isArray(opportunity.tags) ? opportunity.tags : []
      })) as Opportunity[]
    );
    setIsLoading(false);
  }

  useEffect(() => {
    fetchOpportunities();
  }, []);

  function openEditModal(opportunity: Opportunity) {
    setEditingOpportunity(opportunity);
    setFormState(opportunity);
    setTagsInput(opportunity.tags.join(", "));
    setError(null);
  }

  function closeEditModal() {
    setEditingOpportunity(null);
    setFormState(emptyOpportunity);
    setTagsInput("");
    setIsSaving(false);
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingOpportunity) {
      return;
    }

    if (!editingOpportunity.id) {
      setError("Unable to update opportunity: missing row id.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const payload: OpportunityInsert = {
      title: formState.title.trim(),
      organization: formState.organization.trim(),
      category: formState.category.trim(),
      status: formState.status,
      description: formState.description.trim(),
      location: formState.location.trim(),
      tags: parseTagsInput(tagsInput),
      deadline: formState.deadline
    };

    const supabase = createBrowserAuthClient();
    const { data: updatedRows, error: updateError } = await supabase
      .from("opportunities")
      .update(payload)
      .eq("id", editingOpportunity.id)
      .select("id, title, organization, category, status, description, location, tags, deadline");

    if (updateError) {
      setError(updateError.message);
      setIsSaving(false);
      return;
    }

    if (!updatedRows || updatedRows.length === 0) {
      setError(
        "Update did not change any rows. Check that this opportunity id exists and that Supabase RLS allows authenticated updates."
      );
      setIsSaving(false);
      return;
    }

    const updatedOpportunity = {
      ...updatedRows[0],
      tags: Array.isArray(updatedRows[0].tags) ? updatedRows[0].tags : []
    } as Opportunity;

    setOpportunities((current) =>
      current.map((opportunity) => (opportunity.id === editingOpportunity.id ? updatedOpportunity : opportunity))
    );

    closeEditModal();
    await fetchOpportunities();
  }

  async function confirmDelete() {
    if (!deletingOpportunity) {
      return;
    }

    if (!deletingOpportunity.id) {
      setError("Unable to delete opportunity: missing row id.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const supabase = createBrowserAuthClient();
    const { error: deleteError } = await supabase.from("opportunities").delete().eq("id", deletingOpportunity.id);

    if (deleteError) {
      setError(deleteError.message);
      setIsSaving(false);
      return;
    }

    setOpportunities((current) => current.filter((opportunity) => opportunity.id !== deletingOpportunity.id));
    setDeletingOpportunity(null);
    setIsSaving(false);
    await fetchOpportunities();
  }

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">{item.label}</span>
              <span className="grid size-10 place-items-center rounded-lg bg-cyan-100 text-cyan-800">
                <item.icon aria-hidden />
              </span>
            </div>
            <p className="mt-4 text-3xl font-black">{isLoading ? "..." : item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">Manage opportunities</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {isLoading ? "Loading" : opportunities.length} live listings
              </p>
            </div>
            <button
              type="button"
              onClick={fetchOpportunities}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:border-cyan-300 hover:bg-cyan-50"
            >
              <FiRefreshCw aria-hidden />
              Refresh
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>
          ) : null}

          {isLoading ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-52 animate-pulse rounded-lg border border-slate-200 bg-[#f7f8fb]" />
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="mt-5 rounded-lg border border-slate-200 bg-[#f7f8fb] p-8 text-center">
              <h3 className="text-lg font-black">No opportunities to manage</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">New opportunities will appear here after they are added.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {opportunities.map((opportunity, index) => (
                <article
                  key={`${opportunity.title}-${opportunity.organization}-${opportunity.deadline}-${index}`}
                  className="rounded-lg border border-slate-200 bg-[#f7f8fb] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-cyan-700">{opportunity.category}</p>
                      <h3 className="mt-1 text-lg font-black leading-6 text-slate-950">{opportunity.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">{opportunity.organization}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-lime-100 px-3 py-1 text-xs font-black text-lime-800">
                      {opportunity.status}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{opportunity.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {opportunity.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-white px-3 py-1 text-xs font-bold text-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-slate-500">
                      {opportunity.location} - {opportunity.deadline}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(opportunity)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-950 transition hover:border-cyan-300 hover:bg-cyan-50"
                      >
                        <FiEdit2 aria-hidden />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingOpportunity(opportunity)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
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
          <h2 className="mb-4 text-xl font-black">Recent listing</h2>
          {isLoading ? (
            <div className="h-72 animate-pulse rounded-lg border border-slate-200 bg-white shadow-sm" />
          ) : latestOpportunity ? (
            <OpportunityCard opportunity={latestOpportunity} />
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h3 className="text-lg font-black">No recent listing</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Add an opportunity to populate this panel.</p>
            </div>
          )}
        </section>
      </div>

      {editingOpportunity ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 px-5 py-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">Edit opportunity</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">Update live Supabase data.</p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="grid size-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                aria-label="Close edit modal"
              >
                <FiX aria-hidden />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Title", "title", "text"],
                  ["Organization", "organization", "text"],
                  ["Category", "category", "text"],
                  ["Location", "location", "text"],
                  ["Deadline", "deadline", "date"]
                ].map(([label, name, type]) => (
                  <label key={name} className="grid gap-2 text-sm font-bold text-slate-700">
                    {label}
                    <input
                      type={type}
                      required
                      value={formState[name as keyof Opportunity] as string}
                      onChange={(event) => setFormState((current) => ({ ...current, [name]: event.target.value }))}
                      className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    />
                  </label>
                ))}
              </div>

              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
                Status
                <select
                  required
                  value={formState.status}
                  onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value }))}
                  className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
                Description
                <textarea
                  required
                  value={formState.description}
                  onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                  className="min-h-32 rounded-lg border border-slate-300 bg-white p-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
                Tags
                <input
                  required
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  placeholder="React, Figma, AI"
                />
              </label>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deletingOpportunity ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 px-5 py-6">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="text-xl font-black">Delete opportunity?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This will remove <span className="font-bold text-slate-950">{deletingOpportunity.title}</span> from Supabase.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-50"
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
