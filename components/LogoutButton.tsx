"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { createBrowserAuthClient } from "@/lib/auth";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    const supabase = createBrowserAuthClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:border-cyan-300 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:text-slate-400"
    >
      <FiLogOut aria-hidden />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
