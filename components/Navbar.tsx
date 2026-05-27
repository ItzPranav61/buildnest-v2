"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiHome, FiList, FiPlusCircle } from "react-icons/fi";

const links = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/opportunities", label: "Opportunities", icon: FiList },
  { href: "/add", label: "Add", icon: FiPlusCircle },
  { href: "/dashboard", label: "Dashboard", icon: FiGrid }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#040814]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/nestbot.png"
            alt="BuildNest"
            width={44}
            height={44}
            className="size-[38px] rounded-xl object-cover drop-shadow-[0_0_22px_rgba(34,211,238,0.28)] sm:size-11"
            priority
          />
          <span>
            <span className="block text-lg font-black leading-5 text-white">BuildNest</span>
            <span className="block text-xs font-semibold text-slate-400">Student builder board</span>
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
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 transition duration-200 hover:bg-cyan-200"
        >
          <FiPlusCircle aria-hidden /> Add
        </Link>
      </nav>
    </header>
  );
}
