import { useState } from "react";

const STORAGE_KEY = "jchcfest-favorites";

function loadFavorites(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed as number[]);
    return new Set();
  } catch {
    return new Set();
  }
}

function saveFavorites(ids: Set<number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // localStorage may be unavailable in some private-browsing contexts
  }
}

export interface UseFavoritesReturn {
  favorites: Set<number>;
  isFavorite: (id: number) => boolean;
  toggle: (id: number) => void;
  count: number;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Set<number>>(loadFavorites);

  function toggle(id: number) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveFavorites(next);
      return next;
    });
  }

  return {
    favorites,
    isFavorite: (id: number) => favorites.has(id),
    toggle,
    count: favorites.size,
  };
}
