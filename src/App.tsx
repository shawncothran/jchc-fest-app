import {
  DndContext,
  DragOverlay,
  type DragMoveEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import CountdownBanner from "./components/CountdownBanner";
import EmptyState from "./components/EmptyState";
import FilterTabs, { type FilterValue } from "./components/FilterTabs";
import Header from "./components/Header";
import InstallPrompt from "./components/InstallPrompt";
import NotificationBanner from "./components/NotificationBanner";
import ScheduleList from "./components/ScheduleList";
import TacoCard from "./components/TacoCard";
import {
  FESTIVAL_DATE,
  FESTIVAL_DATE_DISPLAY,
  FESTIVAL_YEAR,
  sets,
  type ScheduleSet,
} from "./data/schedule";
import { useFavorites } from "./hooks/useFavorites";
import { useTacoPosition } from "./hooks/useTacoDragGesture";
import {
  getPermissionStatus,
  requestPermission,
  syncReminders,
} from "./utils/notifications";
import { computeTacoAfterSetId, getTacoWindowLabel } from "./utils/tacoTime";

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
  if (!isFestivalDay()) {
    return null;
  }
  const nowMin = getNowMinutes();
  for (const s of sets) {
    if (nowMin >= s.startMinutes && nowMin < s.endMinutes) {
      return s.id;
    }
  }
  return null;
}

type ScheduleItem = { type: "set"; set: ScheduleSet } | { type: "taco" };

function buildItems(
  visibleSets: ScheduleSet[],
  tacoAfterSetId: number,
  filter: FilterValue
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

function ScheduleContent({
  favorites,
  isFavorite,
  toggle,
  count,
  filter,
  setFilter,
  notifStatus,
  onRequestNotifications,
  activeSetId,
}: {
  favorites: Set<number>;
  isFavorite: (id: number) => boolean;
  toggle: (id: number) => void;
  count: number;
  filter: FilterValue;
  setFilter: (f: FilterValue) => void;
  notifStatus: NotificationPermission | "unsupported" | undefined;
  onRequestNotifications: () => void;
  activeSetId: number | null;
}) {
  const { tacoPosition, setTacoPosition } = useTacoPosition(favorites);
  const [isDragging, setIsDragging] = useState(false);
  // Preview position while dragging — moves in real-time as cursor hovers sets
  const [previewPosition, setPreviewPosition] = useState<number | null>(null);

  const displayPosition = previewPosition ?? tacoPosition;

  const visibleSets =
    filter === "all" ? sets : sets.filter((s) => isFavorite(s.id));

  const items = buildItems(visibleSets, displayPosition, filter);

  const cardInfoRef = useRef<{ height: number; tacoIndex: number } | null>(
    null
  );

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const rect =
      event.active.rect.current.translated ?? event.active.rect.current.initial;
    const tacoIndex = visibleSets.findIndex((s) => s.id === tacoPosition);
    cardInfoRef.current = {
      height: rect?.height ?? 80,
      tacoIndex: tacoIndex >= 0 ? tacoIndex : 0,
    };
  };

  const handleDragMove = (event: DragMoveEvent) => {
    if (!cardInfoRef.current) {
      return;
    }
    // Lazily pick up height if it wasn't available at drag start
    if (cardInfoRef.current.height === 80) {
      const rect =
        event.active.rect.current.translated ??
        event.active.rect.current.initial;
      if (rect) {
        cardInfoRef.current = { ...cardInfoRef.current, height: rect.height };
      }
    }
    const { height, tacoIndex } = cardInfoRef.current;
    const offset = Math.round(event.delta.y / height);
    const targetIndex = Math.max(
      0,
      Math.min(visibleSets.length - 1, tacoIndex + offset)
    );
    const targetSetId = visibleSets[targetIndex].id;
    setPreviewPosition(targetSetId === tacoPosition ? null : targetSetId);
  };

  const handleDragEnd = () => {
    if (previewPosition !== null) {
      setTacoPosition(previewPosition);
    }
    setIsDragging(false);
    setPreviewPosition(null);
    cardInfoRef.current = null;
  };

  const handleDragCancel = () => {
    setIsDragging(false);
    setPreviewPosition(null);
    cardInfoRef.current = null;
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="sticky top-0 z-50">
          <Header />
          <InstallPrompt />
          <FilterTabs
            filter={filter}
            onChange={setFilter}
            favoriteCount={count}
          />
        </div>
        <NotificationBanner
          status={notifStatus}
          onRequest={onRequestNotifications}
        />
        <CountdownBanner favorites={favorites} />

        <main className="max-w-2xl mx-auto px-4 py-6">
          {visibleSets.length === 0 ? (
            <EmptyState onShowAll={() => setFilter("all")} />
          ) : (
            <ScheduleList
              items={items}
              tacoAfterSetId={displayPosition}
              activeSetId={activeSetId}
              isFavorite={isFavorite}
              onToggleFavorite={toggle}
              showGhost={isDragging && previewPosition !== null}
            />
          )}
        </main>

        <footer className="max-w-2xl mx-auto px-4 py-10 text-center text-xs text-zinc-600">
          <p>
            JCHC Fest · {FESTIVAL_DATE_DISPLAY}, {FESTIVAL_YEAR} ·{" "}
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

      {/* Floating card that follows the cursor during drag */}
      <DragOverlay>
        {isDragging ? (
          <TacoCard windowLabel={getTacoWindowLabel(displayPosition)} overlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default function App() {
  const { favorites, isFavorite, toggle, count } = useFavorites();
  const [filter, setFilter] = useState<FilterValue>("all");
  const [notifStatus, setNotifStatus] = useState<
    NotificationPermission | "unsupported" | undefined
  >(() => getPermissionStatus());
  const [activeSetId, setActiveSetId] = useState<number | null>(getActiveSetId);

  // Track the active (currently playing) set — updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSetId(getActiveSetId());
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Re-sync reminders whenever favorites or notification permission changes
  useEffect(() => {
    syncReminders(favorites, sets, computeTacoAfterSetId(favorites));
  }, [favorites, notifStatus]);

  const handleRequestNotifications = async () => {
    const result = await requestPermission();
    setNotifStatus(result);
  };

  return (
    <ScheduleContent
      favorites={favorites}
      isFavorite={isFavorite}
      toggle={toggle}
      count={count}
      filter={filter}
      setFilter={setFilter}
      notifStatus={notifStatus}
      onRequestNotifications={() => void handleRequestNotifications()}
      activeSetId={activeSetId}
    />
  );
}
