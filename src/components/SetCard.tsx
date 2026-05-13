import type { ScheduleSet } from "../data/schedule";

interface SetCardProps {
  set: ScheduleSet;
  isFavorite: boolean;
  onToggle: () => void;
  /** Pass true if this is the currently-playing set */
  isActive?: boolean;
}

export default function SetCard({
  set,
  isFavorite,
  onToggle,
  isActive,
}: SetCardProps) {
  return (
    <article
      className={`relative rounded-xl border transition-colors ${
        isActive
          ? "bg-zinc-800 border-brand-600"
          : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
      }`}
      aria-label={`${set.name}, ${set.startTime} to ${set.endTime}`}
    >
      {isActive && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full bg-brand-500 animate-pulse"
            aria-hidden="true"
          />
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
            Live Now
          </span>
        </div>
      )}

      <div
        className={`flex items-start gap-4 px-4 ${isActive ? "pt-8 pb-4" : "py-4"}`}
      >
        {/* Band image / placeholder */}
        {set.imageUrl ? (
          <img
            src={set.imageUrl}
            alt={set.name}
            className="w-14 h-14 rounded-lg object-cover shrink-0 bg-zinc-800"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-lg shrink-0 bg-zinc-800 flex items-center justify-center text-zinc-600 text-xl font-display select-none"
            aria-hidden="true"
          >
            {set.name[0]}
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-zinc-400 mb-1 tabular-nums">
            {set.startTime}
            <span className="mx-1 text-zinc-600">–</span>
            {set.endTime}
          </p>
          <h2 className="font-display text-white text-lg leading-tight truncate">
            {set.name}
          </h2>
          {set.description && (
            <p className="mt-2 text-sm text-zinc-400 leading-snug line-clamp-2">
              {set.description}
            </p>
          )}
        </div>

        {/* Favorite toggle */}
        <button
          onClick={onToggle}
          aria-label={
            isFavorite
              ? `Remove ${set.name} from must-see`
              : `Add ${set.name} to must-see`
          }
          aria-pressed={isFavorite}
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            isFavorite
              ? "text-brand-500 bg-brand-950/60"
              : "text-zinc-600 bg-zinc-800 hover:text-zinc-400"
          }`}
        >
          {isFavorite ? (
            // Filled heart
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            // Outline heart
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          )}
        </button>
      </div>
    </article>
  );
}
