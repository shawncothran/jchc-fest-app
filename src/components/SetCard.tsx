import type { ScheduleSet } from "../data/schedule";

interface SetCardProps {
  set: ScheduleSet;
  isFavorite: boolean;
  onToggle: () => void;
  onPlayVideo?: () => void;
  /** Pass true if this is the currently-playing set */
  isActive?: boolean;
}

export default function SetCard({
  set,
  isFavorite,
  onToggle,
  onPlayVideo,
  isActive,
}: SetCardProps) {
  return (
    <article
      className={`relative rounded-xl transition-colors ${
        isActive
          ? "bg-zinc-800 border-2 border-brand-500"
          : "border border-zinc-800 bg-zinc-900 hover:border-zinc-700"
      }`}
      aria-label={`${set.name}, ${set.startTime} to ${set.endTime}`}
    >
      {isActive && (
        <div className="absolute top-2 left-3 flex items-center gap-1.5 bg-brand-600 px-2 py-0.5 rounded-full">
          <span
            className="inline-block w-2 h-2 rounded-full bg-white animate-pulse"
            aria-hidden="true"
          />
          <span className="text-xs font-bold text-white uppercase tracking-widest">
            Live Now
          </span>
        </div>
      )}

      <div
        className={`flex items-center gap-3 px-3 ${isActive ? "pt-7 pb-3" : "py-3"}`}
      >
        {/* Band image / placeholder */}
        {set.imageUrl ? (
          <img
            src={set.imageUrl}
            alt={set.name}
            className="w-12 h-12 rounded-lg object-cover shrink-0 bg-zinc-800"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-lg shrink-0 bg-zinc-800 flex items-center justify-center text-zinc-600 text-lg font-display select-none"
            aria-hidden="true"
          >
            {set.name[0]}
          </div>
        )}

        {/* Main content — flex container for play button + text info */}
        <div className="flex-1 min-w-0 flex items-start gap-2">
          {/* Video play button — only if available */}
          {set.youtubeUrl ? (
            <button
              onClick={onPlayVideo}
              aria-label={`Watch ${set.name} on YouTube`}
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 text-zinc-500 bg-zinc-800 hover:text-zinc-300 hover:bg-zinc-700 mt-0.5"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                {/* Triangle play icon */}
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          ) : null}

          {/* Band info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-500 tabular-nums">
              {set.startTime}
              <span className="mx-1 text-zinc-700">–</span>
              {set.endTime}
            </p>
            <h2 className="font-display text-white text-sm leading-tight tracking-tighter truncate">
              {set.name}
            </h2>
            {set.description ? (
              <p className="mt-1 text-xs text-zinc-500 leading-snug line-clamp-2">
                {set.description}
              </p>
            ) : null}
          </div>
        </div>

        {/* Favorite toggle — furthest right */}
        <button
          onClick={onToggle}
          aria-label={
            isFavorite
              ? `Remove ${set.name} from can&apos;t miss`
              : `Add ${set.name} to can&apos;t miss`
          }
          aria-pressed={isFavorite}
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
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
              <path d="M11.6 21v-.1l-.4-.2A25 25 0 0 1 7 17.5c-2.3-2.1-4.7-5.3-4.7-9.2 0-3 2.4-5.3 5.4-5.3A6 6 0 0 1 12 5a6 6 0 0 1 4.3-2c3 0 5.4 2.3 5.4 5.3 0 3.9-2.4 7-4.7 9.2a25 25 0 0 1-4.2 3.2l-.4.2h-.8" />
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
                d="M21 8.25a4.6 4.6 0 0 0-4.69-4.5A4.7 4.7 0 0 0 12 6.48a4.7 4.7 0 0 0-4.31-2.73A4.6 4.6 0 0 0 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12"
              />
            </svg>
          )}
        </button>
      </div>
    </article>
  );
}
