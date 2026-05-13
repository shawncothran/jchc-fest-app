export interface ScheduleSet {
  id: number;
  name: string;
  startTime: string; // display string, e.g. "12:00 PM"
  endTime: string; // display string, e.g. "12:20 PM"
  startMinutes: number; // minutes from midnight – used for sorting & notification scheduling
  endMinutes: number;
  description?: string;
  imageUrl?: string;
  genre?: string;
}

export const FESTIVAL_DATE = "2026-07-18"; // ISO date string – update each year
export const FESTIVAL_DATE_DISPLAY = "July 18"; // human-readable – update each year
export const FESTIVAL_NAME = "JCHC Fest";
export const FESTIVAL_YEAR = "2026";
export const DOORS_OPEN = "11:30 AM";

/** Convert a "HH:MM AM/PM" string to minutes from midnight */
function toMinutes(time: string): number {
  const [timePart, period] = time.split(" ");
  const [h, m] = timePart.split(":").map(Number);
  let hours = h;
  if (period === "PM" && hours !== 12) {
    hours += 12;
  }
  if (period === "AM" && hours === 12) {
    hours = 0;
  }
  return hours * 60 + m;
}

// ─── REPLACE THIS DATA EACH YEAR ─────────────────────────────────────────────
// Only public-facing sets are listed here (no Load In / Soundcheck / Doors).
// Fields: name, start, end, genre, description (optional), imageUrl (optional)
// ─────────────────────────────────────────────────────────────────────────────
const rawSets = [
  {
    id: 1,
    name: "Nomads",
    start: "12:00 PM",
    end: "12:20 PM",
  },
  {
    id: 2,
    name: "Saul of Tarsus",
    start: "12:35 PM",
    end: "1:00 PM",
  },
  {
    id: 3,
    name: "Headnoise",
    start: "1:15 PM",
    end: "1:45 PM",
  },
  {
    id: 4,
    name: "TAKE",
    start: "2:00 PM",
    end: "2:30 PM",
  },
  {
    id: 5,
    name: "Deathbreaker",
    start: "2:45 PM",
    end: "3:15 PM",
  },
  {
    id: 6,
    name: "Light The Way",
    start: "3:30 PM",
    end: "4:00 PM",
  },
  {
    id: 7,
    name: "Watashi Wa",
    start: "4:15 PM",
    end: "4:45 PM",
  },
  {
    id: 8,
    name: "BARRIERS",
    start: "5:00 PM",
    end: "5:30 PM",
  },
  {
    id: 9,
    name: "xDoulosx",
    start: "5:45 PM",
    end: "6:15 PM",
  },
  {
    id: 10,
    name: "Dear Adversary",
    start: "6:35 PM",
    end: "7:10 PM",
  },
  {
    id: 11,
    name: "Symphony in Peril",
    start: "7:25 PM",
    end: "8:05 PM",
  },
  {
    id: 12,
    name: "Officer Negative",
    start: "8:20 PM",
    end: "9:00 PM",
  },
  {
    id: 13,
    name: "Cultist",
    start: "9:15 PM",
    end: "10:00 PM",
  },
];

export const sets: ScheduleSet[] = rawSets.map((s) => ({
  id: s.id,
  name: s.name,
  startTime: s.start,
  endTime: s.end,
  startMinutes: toMinutes(s.start),
  endMinutes: toMinutes(s.end),
}));
