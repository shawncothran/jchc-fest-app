interface EmptyStateProps {
  onShowAll: () => void;
}

export default function EmptyState({ onShowAll }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      {/* Outline heart */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        className="w-16 h-16 text-zinc-700 mb-4"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <h2 className="font-display text-xl text-white mb-2">
        No Can&apos;t Miss Sets Yet
      </h2>
      <p className="text-zinc-400 text-sm max-w-xs mb-6 leading-relaxed">
        Tap the heart on any set to save it here. Build your personal lineup.
      </p>
      <button
        onClick={onShowAll}
        className="border border-white hover:bg-white/10 active:bg-white/20 text-white font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-lg transition-colors"
      >
        Browse All Sets
      </button>
    </div>
  );
}
