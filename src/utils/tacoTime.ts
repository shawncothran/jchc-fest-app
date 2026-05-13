/**
 * tacoTime.ts
 *
 * Computes the recommended taco break position in the schedule.
 *
 * Logic:
 * 1. If the user has favorites AND none of them fall in the 4:45–7:25 PM
 *    window, they have a natural free stretch — recommend taco break right
 *    after Watashi Wa (id 7, ends 4:45 PM), the last set before the window.
 * 2. Otherwise, use the biggest changeover gap: after xDoulosx (id 9),
 *    which has a 20-minute backline swap before Dear Adversary.
 */

import { sets, type ScheduleSet } from "../data/schedule";

// ID of the set with the biggest changeover gap (xDoulosx → 20 min swap)
const BIGGEST_GAP_AFTER_ID = 9;

// ID of the last set before the 4:45–7:25 "free window" (Watashi Wa, ends 4:45 PM)
const FREE_WINDOW_BEFORE_ID = 7;

// The free window in minutes from midnight
const WINDOW_START_MIN = 16 * 60 + 45; // 4:45 PM
const WINDOW_END_MIN = 19 * 60 + 25; // 7:25 PM

export function computeTacoAfterSetId(favorites: Set<number>): number {
  if (favorites.size > 0) {
    const hasFavInWindow = sets.some(
      (s) =>
        favorites.has(s.id) &&
        s.startMinutes >= WINDOW_START_MIN &&
        s.startMinutes < WINDOW_END_MIN,
    );
    if (!hasFavInWindow) {
      return FREE_WINDOW_BEFORE_ID;
    }
  }
  return BIGGEST_GAP_AFTER_ID;
}

/** Returns the gap window label for a given taco position, e.g. "6:15 – 6:35 PM" */
export function getTacoWindowLabel(afterSetId: number): string {
  const afterSet = sets.find((s) => s.id === afterSetId);
  const nextSet = sets.find(
    (s) => afterSet != null && s.startMinutes > afterSet.endMinutes,
  );
  if (!afterSet || !nextSet) return "";
  return `${afterSet.endTime} – ${nextSet.startTime}`;
}

export type { ScheduleSet };
