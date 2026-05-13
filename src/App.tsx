import { DndContext, pointerWithin, type DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import CountdownBanner from "./components/CountdownBanner";
import EmptyState from "./components/EmptyState";
import FilterTabs, { type FilterValue } from "./components/FilterTabs";
import Header from "./components/Header";
import NotificationBanner from "./components/NotificationBanner";
import ScheduleList from "./components/ScheduleList";
import { FESTIVAL_DATE, sets, type ScheduleSet } from "./data/schedule";
import { useFavorites } from "./hooks/useFavorites";
import { useTacoDragDrop } from "./hooks/useTacoDragDrop";
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

type ScheduleItem = { type: "set"; set: ScheduleSet } | { type: "taco" };

function buildItems(
  visibleSets: ScheduleSet[],
  tacoAfterSetId: number,
  filter: FilterValue,
): ScheduleItem[] {
  const items: ScheduleItem[] = [];
  let tacoPlaced = false;
  for (const set of visibleSets) {
    items.push({ type: "set", set });
    if (set.id === tacoAfterSetId) {
      items.push({ type: "taco" });
      tacoPlaced = true;
    }
  }
  // In all-sets view always show the taco card, even if its anchor set is hidden
  if (!tacoPlaced && filter === "all") {
    items.push({ type: "taco" });
  }
  return items;
}

export default function App() {
  const { favorites, isFavorite, toggle, count } = useFavorites();
  const [filter, setFilter] = useState<FilterValue>("all");
  const [notifStatus, setNotifStatus] = useState<
    NotificationPermission | "unsupported" | undefined
  >(undefined);
  const [activeSetId, setActiveSetId] = useState<number | null>(getActiveSetId);

  // Taco drag-and-drop state
  const tacoDragDrop = useTacoDragDrop(favorites);

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

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.active.id === "taco-card" && event.over) {
      const overIdStr = String(event.over.id);
      if (overIdStr.startsWith("drop-")) {
        const setId = parseInt(overIdStr.replace("drop-", ""), 10);
        tacoDragDrop.setTacoAfterSetId(setId);
        tacoDragDrop.setTacoManuallyMoved(true);
      }
    }
  };

  const visibleSets =
    filter === "all" ? sets : sets.filter((s) => isFavorite(s.id));

  const items = buildItems(visibleSets, tacoDragDrop.displayPosition, filter);

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <div className="min-h-screen bg-zinc-950 text-white">
        <Header />
        <NotificationBanner
          status={notifStatus}
          onRequest={handleRequestNotifications}
        />
        <CountdownBanner favorites={favorites} />
        <FilterTabs
          filter={filter}
          onChange={setFilter}
          favoriteCount={count}
        />

        <main className="max-w-2xl mx-auto px-4 py-4">
          {visibleSets.length === 0 ? (
            <EmptyState onShowAll={() => setFilter("all")} />
          ) : (
            <ScheduleList
              items={items}
              tacoAfterSetId={tacoDragDrop.tacoAfterSetId}
              activeSetId={activeSetId}
              isFavorite={isFavorite}
              onToggleFavorite={toggle}
            />
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
    </DndContext>
  );
}
