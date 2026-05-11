import { FormEvent, useMemo, useState } from "react";
import {
  categories,
  type Category,
  type OpportunitySearchResult
} from "@/lib/resources";

type OpportunityRadarProps = {
  isImporting: boolean;
  onImportSelected: (results: OpportunitySearchResult[]) => Promise<void>;
};

const presets = [
  "AI internships India",
  "student hackathons India",
  "open source programs students",
  "free developer tools students",
  "cloud credits students",
  "ML competitions students"
];

const inputClass =
  "min-h-10 w-full min-w-0 rounded-md border border-[#CFC0AA] bg-white px-3.5 py-2 text-sm text-ink outline-none transition placeholder:text-muted hover:border-brand focus:border-brand focus:shadow-[0_0_0_3px_rgba(91,127,255,0.12)]";

export function OpportunityRadar({
  isImporting,
  onImportSelected
}: OpportunityRadarProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [results, setResults] = useState<OpportunitySearchResult[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState("");

  const selectedResults = useMemo(() => {
    return results.filter((result) => selectedLinks.includes(result.link));
  }, [results, selectedLinks]);

  async function runSearch(searchQuery: string) {
    const trimmedQuery = searchQuery.trim();

    if (isSearching || !trimmedQuery) {
      return;
    }

    setIsSearching(true);
    setMessage("");
    setSelectedLinks([]);

    try {
      const params = new URLSearchParams({
        query: trimmedQuery,
        category
      });
      const response = await fetch(`/api/search-opportunities?${params.toString()}`);
      const payload = (await response.json()) as {
        results?: OpportunitySearchResult[];
        error?: string;
      };

      if (!response.ok || payload.error) {
        setResults([]);
        setMessage(payload.error || "Google Search failed. Try another query.");
        return;
      }

      const nextResults = payload.results ?? [];
      setResults(nextResults);
      setMessage(nextResults.length === 0 ? "No results found. Try a broader query." : "");
    } catch {
      setResults([]);
      setMessage("Search failed. Check your connection and try again.");
    } finally {
      setIsSearching(false);
    }
  }

  async function searchOpportunities(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runSearch(query);
  }

  function toggleSelected(link: string) {
    setSelectedLinks((currentLinks) =>
      currentLinks.includes(link)
        ? currentLinks.filter((currentLink) => currentLink !== link)
        : [...currentLinks, link]
    );
  }

  async function importSelected() {
    if (selectedResults.length === 0 || isImporting) {
      return;
    }

    await onImportSelected(selectedResults);
    setSelectedLinks([]);
  }

  return (
    <details className="mb-5 rounded-xl border border-[#D1C1A9] bg-[#E8DFCA] text-ink shadow-[0_14px_34px_rgba(36,48,65,0.12)]">
      <summary className="cursor-pointer list-none px-4 py-4 sm:px-5">
        <span className="text-lg font-bold text-ink">Opportunity Radar</span>
        <span className="mt-1 block text-sm leading-5 text-muted">
          Search Google for useful resources/opportunities.
        </span>
      </summary>

      <div className="border-t border-[#D1C1A9] px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <form onSubmit={searchOpportunities} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_11rem_auto] lg:items-end">
          <label htmlFor="radar-query" className="grid gap-2 text-sm font-semibold text-ink">
            Query
            <input
              id="radar-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={inputClass}
              placeholder="AI internships India"
            />
          </label>

          <label htmlFor="radar-category" className="grid gap-2 text-sm font-semibold text-ink">
            Category
            <select
              id="radar-category"
              value={category}
              onChange={(event) => setCategory(event.target.value as Category | "All")}
              className={inputClass}
            >
              <option>All</option>
              {categories.map((categoryOption) => (
                <option key={categoryOption}>{categoryOption}</option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(91,127,255,0.18)] transition hover:bg-brandDark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setQuery(preset);
                void runSearch(preset);
              }}
              className="rounded-full border border-[#CFC0AA] bg-white px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-brand hover:text-[#304FB8]"
            >
              {preset}
            </button>
          ))}
        </div>

        {message && (
          <p className="mt-4 rounded-lg border border-[#CFC0AA] bg-white px-3 py-2 text-sm font-medium text-muted">
            {message}
          </p>
        )}

        {results.length > 0 && (
          <div className="mt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-ink">
                Review results ({selectedResults.length} selected)
              </p>
              <button
                type="button"
                onClick={importSelected}
                disabled={selectedResults.length === 0 || isImporting}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(91,127,255,0.18)] transition hover:bg-brandDark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isImporting ? "Importing..." : "Import Selected"}
              </button>
            </div>

            <div className="mt-3 grid gap-3">
              {results.map((result) => {
                const isSelected = selectedLinks.includes(result.link);

                return (
                  <article
                    key={result.link}
                    className="rounded-lg border border-[#E2D8C9] bg-[#FFFDFC] p-4 shadow-[0_8px_18px_rgba(36,48,65,0.08)]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words text-base font-bold leading-6 text-ink">
                          {result.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-muted">
                          {result.snippet}
                        </p>
                        <a
                          href={result.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 block break-words text-xs font-semibold text-[#304FB8] hover:underline"
                        >
                          {result.link}
                        </a>
                      </div>

                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleSelected(result.link)}
                        className={`inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          isSelected
                            ? "border-brand bg-brandSoft text-[#304FB8]"
                            : "border-line bg-white text-muted hover:border-brand hover:text-ink"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                      <span className="rounded-full border border-line bg-page px-3 py-1 text-muted">
                        {result.source}
                      </span>
                      <span className="rounded-full border border-[#6D94C5]/35 bg-[#CBDCEB] px-3 py-1 text-ink">
                        {result.categoryGuess}
                      </span>
                      <span className="rounded-full border border-line bg-page px-3 py-1 text-muted">
                        {result.quality} Quality
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </details>
  );
}
