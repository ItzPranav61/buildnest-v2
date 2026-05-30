"use client";

import { FormEvent, useState } from "react";
import { FiMail } from "react-icons/fi";
import { PageViewTracker } from "@/components/Analytics";
import { Navbar } from "@/components/Navbar";
import { createBrowserAuthClient } from "@/lib/auth";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);
    setEmailError(null);

    if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address.");
      setError("Please fix the highlighted fields.");
      setIsSubmitting(false);
      const emailField = event.currentTarget.elements.namedItem("email");
      if (emailField instanceof HTMLElement) {
        emailField.focus();
      }
      return;
    }

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
    <main className="min-h-screen bg-[#040814] text-white">
      <PageViewTracker eventName="login_view" />
      <Navbar />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-7xl min-w-0 items-center gap-8 px-4 py-12 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:py-16">
        <div className="max-w-2xl min-w-0">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">Login</p>
          <h1 className="mt-3 break-words text-4xl font-black leading-tight tracking-normal text-white sm:text-5xl">
            Sign in to BuildNest.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-400">
            Access your protected builder dashboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6"
        >
          <label className="grid gap-2 text-sm font-bold text-slate-300">
            Email
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cyan-200/80" aria-hidden />
              <input
                name="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError(null);
                }}
                required
                aria-invalid={Boolean(emailError)}
                className={`min-h-12 w-full rounded-lg border bg-[#07111f] py-3 pl-10 pr-3 text-sm font-medium text-white outline-none transition placeholder:text-slate-500 focus:ring-4 ${
                  emailError ? "border-red-400/60 focus:border-red-300 focus:ring-red-300/10" : "border-white/10 focus:border-cyan-300 focus:ring-cyan-300/10"
                }`}
                placeholder="you@example.com"
              />
            </div>
            {emailError ? <span className="text-xs font-semibold text-red-200">{emailError}</span> : null}
          </label>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm font-semibold text-red-200 backdrop-blur">
              {error === "Please fix the highlighted fields." ? error : `Unable to sign in: ${error}`}
            </div>
          ) : null}

          {message ? (
            <div className="mt-4 rounded-lg border border-cyan-300/30 bg-cyan-300/10 p-3 text-sm font-semibold text-cyan-100 backdrop-blur">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-gradient-to-r from-cyan-300 to-blue-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-cyan-950/20 transition hover:from-cyan-200 hover:to-blue-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? "Sending link..." : "Send login link"}
          </button>
        </form>
      </section>
    </main>
  );
}
