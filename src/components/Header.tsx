import {
  DOORS_OPEN,
  FESTIVAL_DATE_DISPLAY,
  FESTIVAL_NAME,
  FESTIVAL_YEAR,
} from "../data/schedule";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800 shadow-xl pt-[env(safe-area-inset-top)]">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-white leading-none tracking-tight">
            {FESTIVAL_NAME}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5 tracking-widest uppercase">
            {FESTIVAL_DATE_DISPLAY} · {FESTIVAL_YEAR} · Doors {DOORS_OPEN}
          </p>
        </div>
        <a
          href="https://brushfire.com/jchcministries/jchcfest2026/626483/tickets"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white text-xs font-bold uppercase tracking-widest px-3 py-2 rounded transition-colors"
          aria-label={`Buy tickets for ${FESTIVAL_NAME} ${FESTIVAL_YEAR}`}
        >
          Tickets
        </a>
      </div>
    </header>
  );
}
