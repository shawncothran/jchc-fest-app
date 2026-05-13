import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface DropZoneProps {
  setId: number;
  isDragTarget: boolean;
  children: ReactNode;
}

export default function DropZone({
  setId,
  isDragTarget,
  children,
}: DropZoneProps) {
  const { setNodeRef } = useDroppable({ id: `drop-${setId}` });

  return (
    <div ref={setNodeRef} className="relative">
      {children}
      {/* Drop indicator — shows above while dragging over this zone */}
      {isDragTarget && (
        <div
          className="absolute -top-1.5 left-4 right-4 h-0.5 rounded-full bg-amber-500"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
