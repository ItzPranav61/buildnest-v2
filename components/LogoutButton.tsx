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
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white transition duration-200 hover:border-cyan-300/40 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:text-slate-500"
    >
      <FiLogOut aria-hidden />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
