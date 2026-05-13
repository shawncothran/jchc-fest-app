import { useState } from "react";
import { computeTacoAfterSetId } from "../utils/tacoTime";

const STORAGE_KEY = "jchcfest-taco-position";

// Extract set ID from droppable ID (e.g., "drop-5" → 5)
export function parseDropId(id: unknown): number | null {
  const str = String(id);
  if (str.startsWith("drop-")) {
    const num = parseInt(str.slice(5), 10);
    return Number.isNaN(num) ? null : num;
  }
  return null;
}

function loadTacoPosition(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const num = parseInt(raw, 10);
    return Number.isNaN(num) ? null : num;
  } catch {
    return null;
  }
}

function saveTacoPosition(id: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(id));
  } catch {
    // localStorage may be unavailable
  }
}

interface TacoPositionState {
  tacoPosition: number;
  setTacoPosition: (id: number) => void;
}

/**
 * Manages only the persisted taco position, backed by localStorage.
 * All drag interaction is handled at the DndContext level in ScheduleContent.
 */
export function useTacoPosition(favorites: Set<number>): TacoPositionState {
  const [finalPosition, setFinalPosition] = useState<number | null>(() =>
    loadTacoPosition()
  );

  // If user has never manually moved, recommend based on favorites
  const tacoPosition = finalPosition ?? computeTacoAfterSetId(favorites);

  const setTacoPosition = (id: number) => {
    setFinalPosition(id);
    saveTacoPosition(id);
  };

  return { tacoPosition, setTacoPosition };
}
