import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface DropZoneProps {
  setId: number;
  children: ReactNode;
}

export default function DropZone({ setId, children }: DropZoneProps) {
  const { setNodeRef } = useDroppable({ id: `drop-${setId}` });
  return <div ref={setNodeRef}>{children}</div>;
}
