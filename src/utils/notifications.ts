/**
 * notifications.ts
 *
 * Handles browser notification permissions and local reminder scheduling.
 *
 * Current implementation: browser-local setTimeout scheduling.
 * Reminders fire 15 minutes before each favorited set — but only while the
 * browser tab is open.
 *
 * TODO: True web-push (works when browser is closed)
 * ─────────────────────────────────────────────────
 * 1. Generate VAPID keys (`npx web-push generate-vapid-keys`)
 * 2. Call `navigator.serviceWorker.ready` → `registration.pushManager.subscribe(...)`
 * 3. POST the resulting PushSubscription to your backend, along with favorited set IDs
 * 4. On your backend (Supabase Edge Functions, Vercel cron, Firebase Cloud Messaging):
 *    - Store subscriptions keyed by setId + userId/device
 *    - 15 minutes before each set, send a web-push notification via `web-push` npm package
 * 5. The service worker's `push` event handler displays the notification even when closed
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
 */

import { FESTIVAL_DATE } from "../data/schedule";

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getPermissionStatus(): NotificationPermission | "unsupported" {
  if (!notificationsSupported()) {
    return "unsupported";
  }
  return Notification.permission;
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) {
    return "denied";
  }
  return Notification.requestPermission();
}

// Track all scheduled timers so we can cancel/re-sync them when favorites change
const scheduledTimers = new Map<number, ReturnType<typeof setTimeout>>();

export function clearReminder(setId: number): void {
  const timer = scheduledTimers.get(setId);
  if (timer != null) {
    clearTimeout(timer);
    scheduledTimers.delete(setId);
  }
}

/**
 * Schedules a browser notification 15 minutes before the given set's start time.
 * Only runs while the browser tab is open.
 */
export function scheduleReminder(
  setId: number,
  bandName: string,
  startMinutes: number
): void {
  if (!notificationsSupported()) {
    return;
  }
  clearReminder(setId);

  // Build target reminder Date: festival day at (startMinutes - 15 min)
  const festivalMidnight = new Date(`${FESTIVAL_DATE}T00:00:00`);
  const reminderMs = (startMinutes - 15) * 60 * 1000;
  const reminderTime = new Date(festivalMidnight.getTime() + reminderMs);
  const msUntilReminder = reminderTime.getTime() - Date.now();

  if (msUntilReminder <= 0) {
    return;
  } // already past – don't schedule

  const timer = setTimeout(() => {
    if (notificationsSupported() && Notification.permission === "granted") {
      new Notification("JCHC Fest — Up Next! 🤘", {
        body: `${bandName} starts in 15 minutes. Get to the pit!`,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        tag: `jchcfest-set-${setId}`, // deduplicates repeat notifications
      });
    }
    scheduledTimers.delete(setId);
  }, msUntilReminder);

  scheduledTimers.set(setId, timer);
}

// Reserved timer ID for the taco break reminder (avoids collision with set IDs)
const TACO_TIMER_ID = -1;

/**
 * Re-syncs all scheduled reminders to match the current favorites set.
 * Call this whenever favorites change or permission is granted.
 */
export function syncReminders(
  favoriteIds: Set<number>,
  allSets: Array<{
    id: number;
    name: string;
    startMinutes: number;
    endMinutes: number;
  }>,
  tacoAfterSetId?: number
): void {
  // Clear all existing timers first
  scheduledTimers.forEach((_, id) => clearReminder(id));

  if (!notificationsSupported() || Notification.permission !== "granted") {
    return;
  }

  for (const set of allSets) {
    if (favoriteIds.has(set.id)) {
      scheduleReminder(set.id, set.name, set.startMinutes);
    }
  }

  // Schedule taco break reminder 15 min before the window opens
  if (tacoAfterSetId != null) {
    const anchorSet = allSets.find((s) => s.id === tacoAfterSetId);
    if (anchorSet) {
      const tacoWindowStartMin = anchorSet.endMinutes;
      const festivalMidnight = new Date(`${FESTIVAL_DATE}T00:00:00`);
      const reminderMs = (tacoWindowStartMin - 15) * 60 * 1000;
      const reminderTime = new Date(festivalMidnight.getTime() + reminderMs);
      const msUntilReminder = reminderTime.getTime() - Date.now();
      if (msUntilReminder > 0) {
        const timer = setTimeout(() => {
          if (
            notificationsSupported() &&
            Notification.permission === "granted"
          ) {
            new Notification("JCHC Fest — Taco Time Soon! 🌮", {
              body: "Your taco window opens in 15 minutes. Get your order in!",
              icon: "/icons/icon-192x192.png",
              badge: "/icons/icon-192x192.png",
              tag: "jchcfest-taco",
            });
          }
          scheduledTimers.delete(TACO_TIMER_ID);
        }, msUntilReminder);
        scheduledTimers.set(TACO_TIMER_ID, timer);
      }
    }
  }
}
