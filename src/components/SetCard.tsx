import { useState } from "react";
import type { ScheduleSet } from "../data/schedule";
import { FESTIVAL_NAME, FESTIVAL_YEAR } from "../data/schedule";
import CardRow, {
  cardIconBtnCx,
  cardIconCx,
  cardIconSvgCx,
  cardMetaCx,
  cardTextStackCx,
  cardTimeCx,
  cardTimeDashCx,
  cardTitleCx,
} from "./CardRow";

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
  const [shareHovered, setShareHovered] = useState(false);

  const handleShare = async () => {
    const shareText = `I'm going to see ${set.name} at ${FESTIVAL_NAME} ${FESTIVAL_YEAR}! Check out the full schedule.`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${set.name} at ${FESTIVAL_NAME}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        setShareHovered(true);
        setTimeout(() => setShareHovered(false), 2000);
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    }
  };
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

      <CardRow topPad={isActive}>
        {set.imageUrl ? (
          <img
            src={set.imageUrl}
            alt={set.name}
            className={`${cardIconCx} object-contain p-1 bg-zinc-800`}
          />
        ) : (
          <div
            className={`${cardIconCx} bg-zinc-800 flex items-center justify-center text-zinc-600 text-lg font-display select-none`}
            aria-hidden="true"
          >
            {set.name[0]}
          </div>
        )}

        <div className={`${cardTextStackCx} flex-1 min-w-0`}>
          <p className={cardTimeCx}>
            {set.startTime}
            <span className={cardTimeDashCx}>–</span>
            {set.endTime}
          </p>
          <h2 className={cardTitleCx}>{set.name}</h2>
          {(set.genre ?? set.location) ? (
            <p className={cardMetaCx}>
              {set.genre && set.location
                ? `${set.location} · ${set.genre}`
                : (set.genre ?? set.location)}
            </p>
          ) : null}
        </div>

        {set.youtubeUrl ? (
          <button
            onClick={onPlayVideo}
            aria-label={`Watch ${set.name} on YouTube`}
            className={`${cardIconBtnCx} text-zinc-500 hover:text-zinc-300 hover:cursor-pointer`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6"
              aria-hidden="true"
            >
              <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
            </svg>
          </button>
        ) : null}

        <button
          onClick={() => {
            void handleShare();
          }}
          title={shareHovered ? "Copied!" : "Share"}
          aria-label={`Share ${set.name}`}
          className={`${cardIconBtnCx} text-zinc-600 hover:text-zinc-300 hover:cursor-pointer`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cardIconSvgCx}
            aria-hidden="true"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>

        <button
          onClick={onToggle}
          aria-label={
            isFavorite
              ? `Remove ${set.name} from can't miss`
              : `Add ${set.name} to can't miss`
          }
          aria-pressed={isFavorite}
          className={`${cardIconBtnCx} ${isFavorite ? "text-brand-500" : "text-zinc-600 hover:text-zinc-400"}`}
        >
          <svg
            viewBox="1.25 2.25 21.5 19.85"
            fill={isFavorite ? "currentColor" : "none"}
            stroke={isFavorite ? undefined : "currentColor"}
            strokeWidth={isFavorite ? undefined : 1.5}
            strokeLinecap={isFavorite ? undefined : "round"}
            strokeLinejoin={isFavorite ? undefined : "round"}
            className={cardIconSvgCx}
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </CardRow>
    </article>
  );
}
