import { useState } from "react";
import { computeTacoAfterSetId } from "../utils/tacoTime";

export function useTacoDragDrop(favorites: Set<number>) {
  // Whether the user has manually moved it (blocks auto-recommendation)
  const [tacoManuallyMoved, setTacoManuallyMoved] = useState(false);

  // Preview position while dragging
  const [dragPreviewSetId, setDragPreviewSetId] = useState<number | null>(null);

  // Compute position based on favorites and manual move state
  const tacoAfterSetId =
    !tacoManuallyMoved && favorites.size > 0
      ? computeTacoAfterSetId(favorites)
      : 0;

  return {
    tacoAfterSetId,
    tacoManuallyMoved,
    setTacoManuallyMoved,
    dragPreviewSetId,
    setDragPreviewSetId,
    // The position to actually render: if dragging use preview, else use real
    displayPosition: dragPreviewSetId ?? tacoAfterSetId,
  };
}
