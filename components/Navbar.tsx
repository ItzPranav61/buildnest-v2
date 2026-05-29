"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiGrid, FiHome, FiList, FiMenu, FiPlusCircle, FiX } from "react-icons/fi";

const links = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/opportunities", label: "Opportunities", icon: FiList },
  { href: "/add", label: "Add", icon: FiPlusCircle },
  { href: "/dashboard", label: "Dashboard", icon: FiGrid }
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#040814]/80 backdrop-blur-xl">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setIsOpen(false)}>
          <Image
            src="/nestbot.png"
            alt="BuildNest"
            width={44}
            height={44}
            className="size-[38px] rounded-xl object-cover drop-shadow-[0_0_22px_rgba(34,211,238,0.28)] sm:size-11"
            priority
          />
          <span className="min-w-0">
            <span className="block truncate text-lg font-black leading-5 text-white">BuildNest</span>
            <span className="block truncate text-xs font-semibold text-slate-400">Student builder board</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] p-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition duration-200 hover:bg-white/10 hover:text-white ${
                pathname === link.href ? "bg-cyan-300/10 text-cyan-200" : "text-slate-300"
              }`}
            >
              <link.icon aria-hidden />
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/add"
          className="hidden min-h-10 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 transition duration-200 hover:bg-cyan-200 md:inline-flex"
        >
          <FiPlusCircle aria-hidden /> Add
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/10 md:hidden"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isOpen ? <FiX aria-hidden /> : <FiMenu aria-hidden />}
        </button>

        {isOpen ? (
          <div className="absolute left-4 right-4 top-[calc(100%+0.5rem)] rounded-lg border border-white/10 bg-[#07111f]/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl md:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-bold transition hover:bg-white/10 ${
                  pathname === link.href ? "bg-cyan-300/10 text-cyan-200" : "text-slate-200"
                }`}
              >
                <link.icon className="shrink-0" aria-hidden />
                <span className="min-w-0 truncate">{link.label}</span>
              </Link>
            ))}
          </div>
        ) : null}
      </nav>
    </header>
  );
}
