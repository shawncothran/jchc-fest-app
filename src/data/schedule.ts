export interface ScheduleSet {
  id: number;
  name: string;
  startTime: string; // display string, e.g. "12:00 PM"
  endTime: string; // display string, e.g. "12:20 PM"
  startMinutes: number; // minutes from midnight - used for sorting & notification scheduling
  endMinutes: number;
  description?: string;
  imageUrl?: string;
  genre?: string;
  location?: string;
  youtubeUrl?: string; // YouTube video URL for band discovery
}

export const FESTIVAL_DATE = "2026-07-18"; // ISO date string - update each year
export const FESTIVAL_DATE_DISPLAY = "July 18"; // human-readable - update each year
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
    genre: "Hardcore Punk",
    location: "USA",
    imageUrl: "/logos/nomads.png",
  },
  {
    id: 2,
    name: "Saul of Tarsus",
    start: "12:35 PM",
    end: "1:00 PM",
    genre: "Thrash Metal",
    location: "Inland Empire, CA",
    imageUrl: "/logos/saul-of-tarsus.png",
    youtubeUrl: "https://www.youtube.com/watch?v=zoSQJn3GVRg",
  },
  {
    id: 3,
    name: "Dear Adversary",
    start: "1:15 PM",
    end: "1:45 PM",
    genre: "Melodic Hardcore",
    location: "Orange County, CA",
    imageUrl: "/logos/dear-adversary.png",
    youtubeUrl: "https://www.youtube.com/watch?v=5OveDj52RDo",
  },
  {
    id: 4,
    name: "Headnoise",
    start: "2:00 PM",
    end: "2:30 PM",
    genre: "Punk Rock",
    location: "CA / AZ",
    imageUrl: "/logos/headnoise.png",
    youtubeUrl: "https://www.youtube.com/watch?v=NJ8zfSJvl78",
  },
  {
    id: 5,
    name: "TAKE",
    start: "2:45 PM",
    end: "3:15 PM",
    genre: "Hardcore / Metal",
    location: "Las Vegas, NV",
    imageUrl: "/logos/take.png",
    youtubeUrl: "https://www.youtube.com/watch?v=_VvHPIG2Iy4",
  },
  {
    id: 6,
    name: "Light The Way",
    start: "3:30 PM",
    end: "4:00 PM",
    genre: "Pop Punk",
    location: "Sacramento, CA",
    imageUrl: "/logos/light-the-way.png",
    youtubeUrl: "https://www.youtube.com/watch?v=jJR3HBgr-8Q",
  },
  {
    id: 7,
    name: "Watashi Wa",
    start: "4:15 PM",
    end: "4:45 PM",
    genre: "Emo / Alternative Rock",
    location: "San Luis Obispo, CA",
    imageUrl: "/logos/watashi-wa.png",
    youtubeUrl: "https://www.youtube.com/watch?v=WVkPRCgAt5k",
  },
  {
    id: 8,
    name: "Deathbreaker",
    start: "5:00 PM",
    end: "5:30 PM",
    genre: "Metallic Hardcore",
    location: "Pacific Northwest",
    imageUrl: "/logos/deathbreaker.png",
    youtubeUrl: "https://www.youtube.com/watch?v=S3Qvz8bvu74",
  },
  {
    id: 9,
    name: "BARRIERS",
    start: "5:45 PM",
    end: "6:15 PM",
    genre: "Violent Praise Hardcore",
    location: "Belfast, Northern Ireland",
    imageUrl: "/logos/barriers.png",
    youtubeUrl: "https://www.youtube.com/watch?v=LojNBYf5O7k",
  },
  {
    id: 10,
    name: "xDOULOSx",
    start: "6:30 PM",
    end: "7:05 PM",
    genre: "Straight Edge Hardcore",
    location: "Riverside, CA",
    imageUrl: "/logos/xdoulosx.png",
    youtubeUrl: "https://www.youtube.com/watch?v=wI76_kmc2RQ",
  },
  {
    id: 11,
    name: "Symphony in Peril",
    start: "7:25 PM",
    end: "8:05 PM",
    genre: "Metalcore",
    location: "Columbus, OH",
    imageUrl: "/logos/symphony-in-peril.png",
    youtubeUrl: "https://www.youtube.com/watch?v=VTWkGbngn2I",
  },
  {
    id: 12,
    name: "Officer Negative",
    start: "8:20 PM",
    end: "9:00 PM",
    genre: "Hardcore Punk / Crossover",
    location: "Ventura, CA",
    imageUrl: "/logos/officer-negative.png",
    youtubeUrl: "https://www.youtube.com/watch?v=Yy-mBCuDtBQ",
  },
  {
    id: 13,
    name: "Cultist",
    start: "9:15 PM",
    end: "10:00 PM",
    genre: "Beatdown / Deathcore",
    location: "Inland Empire, CA",
    imageUrl: "/logos/cultist.png",
    youtubeUrl: "https://www.youtube.com/watch?v=05zLI6_Fr7A",
  },
];

export const sets: ScheduleSet[] = rawSets.map((s) => ({
  id: s.id,
  name: s.name,
  startTime: s.start,
  endTime: s.end,
  startMinutes: toMinutes(s.start),
  endMinutes: toMinutes(s.end),
  genre: s.genre,
  location: s.location,
  imageUrl: s.imageUrl,
  youtubeUrl: s.youtubeUrl,
}));
