"use client";

import { useState } from "react";
import { FiCopy } from "react-icons/fi";

type ReferralCodeCardProps = {
  code: string;
};

export function ReferralCodeCard({ code }: ReferralCodeCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();

        const didCopy = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (!didCopy) {
          throw new Error("Copy command failed");
        }
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07] p-5 shadow-xl shadow-cyan-950/10 backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">Referral Code</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <code className="w-fit rounded-lg border border-white/10 bg-[#040814]/80 px-4 py-2 text-lg font-black tracking-[0.16em] text-white">
          {code}
        </code>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/15"
        >
          <FiCopy aria-hidden /> {copied ? "Copied" : "Copy Code"}
        </button>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Use this code while registering so Team CodeStorm can track participants coming from BuildNest.
      </p>
    </section>
  );
}
