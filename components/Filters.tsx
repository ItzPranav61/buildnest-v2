"use client";

const categories = ["All", "Internship", "Hackathon", "Fellowship", "Project"];
const statuses = ["All", "Open", "Upcoming", "Expired"];

type FiltersProps = {
  search: string;
  category: string;
  status: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export function Filters({
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange
}: FiltersProps) {
  return (
    <aside className="w-full max-w-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl shadow-black/10 backdrop-blur sm:p-5 lg:sticky lg:top-24 lg:self-start">
      <h2 className="text-lg font-black text-white">Filters</h2>

      <label className="mt-5 grid gap-2 text-sm font-bold text-slate-300">
        Search
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="min-h-12 w-full min-w-0 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
          placeholder="Title or organization"
        />
      </label>

      <div className="mt-5">
        <p className="text-sm font-bold text-slate-300">Category</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onCategoryChange(item)}
              className={`max-w-full break-words rounded-md border px-3 py-2 text-sm font-bold transition duration-200 hover:border-cyan-300 hover:bg-cyan-300/10 ${
                category === item ? "border-cyan-300 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-white/[0.04] text-slate-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-bold text-slate-300">Status</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {statuses.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onStatusChange(item)}
              className={`max-w-full break-words rounded-md border px-3 py-2 text-sm font-bold transition duration-200 hover:border-cyan-300 hover:bg-cyan-300/10 ${
                status === item ? "border-cyan-300 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-white/[0.04] text-slate-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
