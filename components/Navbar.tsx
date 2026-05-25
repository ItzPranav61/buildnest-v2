import Link from "next/link";
import { FiGrid, FiHome, FiList, FiPlusCircle } from "react-icons/fi";

const links = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/opportunities", label: "Opportunities", icon: FiList },
  { href: "/add", label: "Add", icon: FiPlusCircle },
  { href: "/dashboard", label: "Dashboard", icon: FiGrid }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-slate-950 text-sm font-black text-white">BN</span>
          <span>
            <span className="block text-lg font-black leading-5">BuildNest</span>
            <span className="block text-xs font-semibold text-slate-500">Student builder board</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-[#f7f8fb] p-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-slate-950"
            >
              <link.icon aria-hidden />
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/add"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-700"
        >
          <FiPlusCircle aria-hidden /> Add
        </Link>
      </nav>
    </header>
  );
}
