import type { ReactNode } from "react";

// ── Shared style tokens ───────────────────────────────────────────────────────
// Update these once and both SetCard & TacoCard stay in sync automatically.

export const cardRowCx = "flex items-center gap-1.5 px-2 sm:gap-1.5 sm:px-3";

export const cardIconCx = "w-9 h-9 sm:w-11 sm:h-11 rounded-lg shrink-0";

export const cardTimeCx = "text-xs text-zinc-400 font-medium tabular-nums";

export const cardTimeDashCx = "mx-1 text-zinc-600";

export const cardTitleCx =
  "font-display text-white text-sm sm:text-base md:text-lg leading-tight tracking-[-0.02em] truncate";

export const cardTitleInteractiveCx =
  cardTitleCx + " group-hover:text-zinc-300 transition-colors";

export const cardMetaCx =
  "text-[9px] sm:text-[11px] text-zinc-500 leading-snug truncate";

export const cardMetaInteractiveCx =
  cardMetaCx + " group-hover:text-zinc-400 transition-colors";

/** Stacks time / title / meta with consistent vertical gap */
export const cardTextStackCx = "grid gap-0.5";

export const cardIconBtnCx =
  "shrink-0 flex items-center justify-center transition-all active:scale-90";

export const cardIconSvgCx = "w-5 h-5 sm:w-6 sm:h-6";

// ── CardRow component ─────────────────────────────────────────────────────────

interface CardRowProps {
  children: ReactNode;
  /** Extra top padding when a "Live Now" badge sits above the row */
  topPad?: boolean;
}

export default function CardRow({ children, topPad }: CardRowProps) {
  return (
    <div className={`${cardRowCx} ${topPad ? "pt-8 pb-3" : "py-3"}`}>
      {children}
    </div>
  );
}
