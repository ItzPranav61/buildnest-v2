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
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
      <h2 className="text-lg font-black">Filters</h2>

      <label className="mt-5 grid gap-2 text-sm font-bold text-slate-600">
        Search
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          placeholder="Title or organization"
        />
      </label>

      <div className="mt-5">
        <p className="text-sm font-bold text-slate-600">Category</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onCategoryChange(item)}
              className={`rounded-md border px-3 py-2 text-sm font-bold transition hover:border-cyan-300 hover:bg-cyan-50 ${
                category === item ? "border-cyan-300 bg-cyan-50 text-cyan-800" : "border-slate-200 bg-[#f7f8fb] text-slate-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-bold text-slate-600">Status</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {statuses.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onStatusChange(item)}
              className={`rounded-md border px-3 py-2 text-sm font-bold transition hover:border-cyan-300 hover:bg-cyan-50 ${
                status === item ? "border-cyan-300 bg-cyan-50 text-cyan-800" : "border-slate-200 bg-[#f7f8fb] text-slate-700"
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
