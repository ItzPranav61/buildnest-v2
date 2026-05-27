"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
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

export function OpportunityForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
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
      deadline: String(formData.get("deadline") ?? "").trim(),
    };

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
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10 backdrop-blur">
      <div className="grid gap-4 sm:grid-cols-2">
        {textFields.map((field) => (
          <label key={field.label} className="grid gap-2 text-sm font-bold text-slate-300">
            {field.label}
            <input
              name={field.name}
              type={field.type}
              required
              className="min-h-12 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
              placeholder={field.placeholder}
            />
          </label>
        ))}
      </div>

      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
        Status
        <select
          name="status"
          required
          defaultValue="Open"
          className="min-h-12 rounded-lg border border-white/10 bg-[#0b1220] px-3 text-sm font-medium text-white outline-none transition duration-200 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
        Description
        <textarea
          name="description"
          required
          className="min-h-32 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
          placeholder="Describe who this is for, what students will build, and what they receive."
        />
      </label>

      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300">
        Tags
        <input
          name="tags"
          required
          className="min-h-12 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
          placeholder="React, Figma, AI, GitHub"
        />
      </label>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          Unable to add opportunity: {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-gradient-to-r from-cyan-300 to-blue-400 px-5 py-3 text-sm font-black text-slate-950 transition duration-200 hover:from-cyan-200 hover:to-blue-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Saving..." : "Add opportunity"}
      </button>
    </form>
  );
}
