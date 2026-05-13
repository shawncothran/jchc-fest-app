import { useEffect, useState } from "react";
import EmptyState from "./components/EmptyState";
import FilterTabs, { type FilterValue } from "./components/FilterTabs";
import Header from "./components/Header";
import NotificationBanner from "./components/NotificationBanner";
import SetCard from "./components/SetCard";
import { sets, FESTIVAL_DATE } from "./data/schedule";
import { useFavorites } from "./hooks/useFavorites";
import {
  getPermissionStatus,
  requestPermission,
  syncReminders,
} from "./utils/notifications";

function getNowMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function isFestivalDay(): boolean {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return today === FESTIVAL_DATE;
}

function getActiveSetId(): number | null {
  if (!isFestivalDay()) return null;
  const nowMin = getNowMinutes();
  for (const s of sets) {
    if (nowMin >= s.startMinutes && nowMin < s.endMinutes) return s.id;
  }
  return null;
}

export default function App() {
  const { favorites, isFavorite, toggle, count } = useFavorites();
  const [filter, setFilter] = useState<FilterValue>("all");
  const [notifStatus, setNotifStatus] = useState<
    NotificationPermission | "unsupported" | undefined
  >(undefined);
  const [activeSetId, setActiveSetId] = useState<number | null>(getActiveSetId);

  // Hydrate notification status on mount
  useEffect(() => {
    setNotifStatus(getPermissionStatus());
  }, []);

  // Track the active (currently playing) set — updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSetId(getActiveSetId());
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Re-sync reminders whenever favorites or notification permission changes
  useEffect(() => {
    syncReminders(favorites, sets);
  }, [favorites, notifStatus]);

  async function handleRequestNotifications() {
    const result = await requestPermission();
    setNotifStatus(result);
  }

  const visibleSets =
    filter === "all" ? sets : sets.filter((s) => isFavorite(s.id));

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <NotificationBanner
        status={notifStatus}
        onRequest={handleRequestNotifications}
      />
      <FilterTabs filter={filter} onChange={setFilter} favoriteCount={count} />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {visibleSets.length === 0 ? (
          <EmptyState onShowAll={() => setFilter("all")} />
        ) : (
          visibleSets.map((set) => (
            <SetCard
              key={set.id}
              set={set}
              isFavorite={isFavorite(set.id)}
              onToggle={() => toggle(set.id)}
              isActive={set.id === activeSetId}
            />
          ))
        )}
      </main>

      <footer className="max-w-2xl mx-auto px-4 py-10 text-center text-xs text-zinc-600">
        <p>
          JCHC Fest · July 28, 2026 ·{" "}
          <a
            href="https://www.jchcfest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400 transition-colors underline underline-offset-2"
          >
            jchcfest.com
          </a>
        </p>
      </footer>
    </div>
  );
}
