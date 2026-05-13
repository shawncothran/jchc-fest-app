import { useEffect, useState } from "react";
import { computeTacoAfterSetId } from "../utils/tacoTime";

export function useTacoDragDrop(favorites: Set<number>) {
  // Permanent position (what gets saved)
  const [tacoAfterSetId, setTacoAfterSetId] = useState<number>(() =>
    computeTacoAfterSetId(favorites),
  );

  // Whether the user has manually moved it (blocks auto-recommendation)
  const [tacoManuallyMoved, setTacoManuallyMoved] = useState(false);

  // Preview position while dragging
  const [dragPreviewSetId, setDragPreviewSetId] = useState<number | null>(null);

  // Keep recommendation in sync with favorites (unless user has manually moved)
  useEffect(() => {
    if (!tacoManuallyMoved) {
      setTacoAfterSetId(computeTacoAfterSetId(favorites));
    }
  }, [favorites, tacoManuallyMoved]);

  return {
    tacoAfterSetId,
    setTacoAfterSetId,
    tacoManuallyMoved,
    setTacoManuallyMoved,
    dragPreviewSetId,
    setDragPreviewSetId,
    // The position to actually render: if dragging use preview, else use real
    displayPosition: dragPreviewSetId ?? tacoAfterSetId,
  };
}
