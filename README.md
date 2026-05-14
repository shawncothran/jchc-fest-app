# JCHC Fest — Schedule App

Mobile-first PWA schedule app for JCHC Fest. One day, one stage, all hardcore.

Built with Vite + React + TypeScript + Tailwind CSS v4. Hosted at [app.jchcfest.com](https://app.jchcfest.com).

---

## Local Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Replacing the Schedule

All schedule data lives in **`src/data/schedule.ts`**.

1. Update `FESTIVAL_DATE` (ISO format, e.g. `'2027-07-26'`)
2. Update `FESTIVAL_YEAR` and `DOORS_OPEN`
3. Edit the `rawSets` array — each entry has:

```ts
{
  id: 1,           // unique number, order doesn't matter (sorted by startTime)
  name: 'Band Name',
  start: '12:00 PM',
  end: '12:20 PM',
  genre: 'Hardcore',        // optional
  description: '...',       // optional
  imageUrl: '/bands/band.jpg', // optional – place images in public/bands/
}
```

Only **public-facing sets** go here. Load in, soundcheck, and doors are intentionally omitted.

---

## PWA Icons

Source artwork lives in `src/assets/icon.png`. To regenerate the sized PWA icons:

```bash
node scripts/generate-icons.cjs
```

This produces `icon-192x192.png`, `icon-512x512.png`, and `apple-touch-icon.png` in `public/icons/`.

---

## Deploying to Netlify

Hosted on Netlify — see `netlify.toml` for build config. Every push to `main` auto-deploys.

---

## Embedding in Squarespace

**Option A — Link (recommended):**
Add a button or navigation link in Squarespace pointing to `https://app.jchcfest.com`. Works perfectly on mobile and desktop.

**Option B — Embed as iframe:**
In Squarespace, add a **Code Block** and paste:

```html
<iframe
  src="https://app.jchcfest.com"
  width="100%"
  height="700"
  style="border:none; border-radius:12px;"
  title="JCHC Fest Schedule"
  loading="lazy"
></iframe>
```

Note: PWA install prompts and notifications won't work inside an iframe — link is better for the full experience.

---

## Notifications

Browser notifications are scheduled locally (while the tab is open) 15 minutes before each favorited set. See `src/utils/notifications.ts` for TODO comments on wiring up true web-push for background notifications via a backend (Supabase, Firebase, Vercel cron, etc.).
