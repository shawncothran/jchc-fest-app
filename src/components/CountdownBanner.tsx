import { useEffect, useState } from "react";
import {
  DOORS_OPEN,
  FESTIVAL_DATE,
  sets,
  type ScheduleSet,
} from "../data/schedule";

// ── Helpers ──────────────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Format a millisecond duration into a human-readable string */
function formatMs(ms: number): string {
  if (ms <= 0) {
    return "0:00";
  }
  const totalSecs = Math.floor(ms / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  if (days > 0) {
    return `${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
  }
  if (hours > 0) {
    return `${hours}:${pad(mins)}:${pad(secs)}`;
  }
  if (mins > 0) {
    return `${mins}:${pad(secs)}`;
  }
  return `${secs}s`;
}

/** Parse a display time string ("11:30 AM") to a Date on the festival day */
function festivalTime(timeStr: string): Date {
  const [timePart, period] = timeStr.split(" ");
  const [h, m] = timePart.split(":").map(Number);
  let hours = h;
  if (period === "PM" && hours !== 12) {
    hours += 12;
  }
  if (period === "AM" && hours === 12) {
    hours = 0;
  }
  const d = new Date(`${FESTIVAL_DATE}T00:00:00`);
  d.setHours(hours, m, 0, 0);
  return d;
}

/** Minutes since midnight for a given Date */
function toMinutes(d: Date) {
  return d.getHours() * 60 + d.getMinutes();
}

// ── Countdown logic ───────────────────────────────────────────────────────────

interface CountdownState {
  label: string;
  value: string;
  sub?: string;
}

function computeCountdown(now: Date, favorites: Set<number>): CountdownState {
  const festivalStart = festivalTime(DOORS_OPEN);
  const festivalEnd = festivalTime("10:00 PM"); // last set ends
  const nowMs = now.getTime();
  const nowMin = toMinutes(now);

  // ── Before festival day ───────────────────────────────────────────────────
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  if (todayStr < FESTIVAL_DATE) {
    const msUntilDoors = festivalStart.getTime() - nowMs;
    return {
      label: "Fest starts in",
      value: formatMs(msUntilDoors),
    };
  }

  // ── Festival day ──────────────────────────────────────────────────────────
  if (todayStr === FESTIVAL_DATE) {
    // Before doors
    if (nowMs < festivalStart.getTime()) {
      return {
        label: "Doors open in",
        value: formatMs(festivalStart.getTime() - nowMs),
      };
    }

    // After last set
    if (nowMs >= festivalEnd.getTime()) {
      return { label: "That's a wrap!", value: "🤘", sub: "See you next year" };
    }

    // Find currently playing set
    const playingSet = sets.find(
      (s) => nowMin >= s.startMinutes && nowMin < s.endMinutes
    );

    // Upcoming favorited sets
    const upcomingFavs = sets.filter(
      (s) => favorites.has(s.id) && s.startMinutes > nowMin
    );

    // Next favorited set takes priority
    if (upcomingFavs.length > 0) {
      const next: ScheduleSet = upcomingFavs[0];
      const nextTime = festivalTime(next.startTime);
      return {
        label: "Next can&apos;t miss",
        value: formatMs(nextTime.getTime() - nowMs),
        sub: next.name,
      };
    }

    // Currently playing
    if (playingSet) {
      const endsAt = festivalTime(playingSet.endTime);
      return {
        label: "Now playing",
        value: playingSet.name,
        sub: `ends in ${formatMs(endsAt.getTime() - nowMs)}`,
      };
    }

    // Between sets — next set up
    const nextSet = sets.find((s) => s.startMinutes > nowMin);
    if (nextSet) {
      const nextTime = festivalTime(nextSet.startTime);
      return {
        label: "Up next",
        value: formatMs(nextTime.getTime() - nowMs),
        sub: nextSet.name,
      };
    }
  }

  // ── After festival ────────────────────────────────────────────────────────
  return { label: "That's a wrap!", value: "🤘", sub: "See you next year" };
}

// ── Component ─────────────────────────────────────────────────────────────────

interface CountdownBannerProps {
  favorites: Set<number>;
}

export default function CountdownBanner({ favorites }: CountdownBannerProps) {
  const [state, setState] = useState<CountdownState>(() =>
    computeCountdown(new Date(), favorites)
  );

  useEffect(() => {
    function tick() {
      setState(computeCountdown(new Date(), favorites));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [favorites]);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-3 pb-1">
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-center">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-0.5">
          {state.label}
        </p>
        <p className="font-display text-2xl text-white leading-none tabular-nums">
          {state.value}
        </p>
        {state.sub ? (
          <p className="mt-1 text-xs text-zinc-400">{state.sub}</p>
        ) : null}
      </div>
    </div>
  );
}
