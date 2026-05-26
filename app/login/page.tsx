"use client";

import { FormEvent, useState } from "react";
import { FiMail } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { createBrowserAuthClient } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    const supabase = createBrowserAuthClient();
    const origin = window.location.origin;
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/dashboard`
      }
    });

    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
      return;
    }

    setMessage("Check your email for the BuildNest sign-in link.");
    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <Navbar />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">Login</p>
          <h1 className="mt-2 text-4xl font-black tracking-normal sm:text-5xl">Sign in to BuildNest.</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Use your email to access the protected dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Email
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="min-h-12 w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                placeholder="you@example.com"
              />
            </div>
          </label>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              Unable to sign in: {error}
            </div>
          ) : null}

          {message ? (
            <div className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-3 text-sm font-semibold text-cyan-800">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
          >
            {isSubmitting ? "Sending link..." : "Send login link"}
          </button>
        </form>
      </section>
    </main>
  );
}
