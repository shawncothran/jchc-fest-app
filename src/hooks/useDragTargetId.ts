import { useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";

export function useDragTargetId() {
  const [dragTargetId, setDragTargetId] = useState<string | null>(null);

  useDndMonitor({
    onDragMove(event) {
      if (event.over) {
        setDragTargetId(String(event.over.id));
      } else {
        setDragTargetId(null);
      }
    },
    onDragEnd() {
      setDragTargetId(null);
    },
    onDragCancel() {
      setDragTargetId(null);
    },
  });

  return dragTargetId;
}
