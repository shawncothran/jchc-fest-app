export type FilterValue = "all" | "favorites";

interface FilterTabsProps {
  filter: FilterValue;
  onChange: (f: FilterValue) => void;
  favoriteCount: number;
}

export default function FilterTabs({
  filter,
  onChange,
  favoriteCount,
}: FilterTabsProps) {
  return (
    <div className="bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex gap-0" role="tablist" aria-label="Schedule filter">
          <button
            role="tab"
            aria-selected={filter === "all"}
            onClick={() => onChange("all")}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-colors border-b-4 ${
              filter === "all"
                ? "text-white border-brand-500"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            }`}
          >
            All Sets
          </button>
          <button
            role="tab"
            aria-selected={filter === "favorites"}
            onClick={() => onChange("favorites")}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-colors border-b-4 flex items-center justify-center gap-2 ${
              filter === "favorites"
                ? "text-white border-brand-500"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            }`}
          >
            Must-See
            {favoriteCount > 0 && (
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center leading-none ${
                  filter === "favorites"
                    ? "bg-brand-600 text-white"
                    : "bg-zinc-700 text-zinc-300"
                }`}
                aria-label={`${favoriteCount} favorited`}
              >
                {favoriteCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
