interface NotificationBannerProps {
  status: NotificationPermission | "unsupported" | undefined;
  onRequest: () => void;
}

export default function NotificationBanner({
  status,
  onRequest,
}: NotificationBannerProps) {
  // Don't show if already granted, denied, or unsupported
  if (
    !status ||
    status === "granted" ||
    status === "denied" ||
    status === "unsupported"
  ) {
    return null;
  }

  return (
    <div className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3">
        {/* Bell icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-5 h-5 text-white shrink-0"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        <p className="flex-1 text-xs text-zinc-300 leading-snug">
          <span className="font-bold text-white">Enable Reminders</span> — get
          notified 15 min before your can&apos;t miss sets.
        </p>
        <button
          onClick={onRequest}
          className="shrink-0 border border-white hover:bg-white/10 active:bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-colors"
        >
          Enable
        </button>
      </div>
    </div>
  );
}
