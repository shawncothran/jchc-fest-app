import type { ScheduleSet } from "../data/schedule";
import { useDragTargetId } from "../hooks/useDragTargetId";
import { getTacoWindowLabel } from "../utils/tacoTime";
import DropZone from "./DropZone";
import SetCard from "./SetCard";
import TacoCard from "./TacoCard";

type ScheduleItem = { type: "set"; set: ScheduleSet } | { type: "taco" };

interface ScheduleListProps {
  items: ScheduleItem[];
  tacoAfterSetId: number;
  activeSetId: number | null;
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
}

export default function ScheduleList({
  items,
  tacoAfterSetId,
  activeSetId,
  isFavorite,
  onToggleFavorite,
}: ScheduleListProps) {
  const dragTargetId = useDragTargetId();

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) =>
        item.type === "taco" ? (
          <TacoCard
            key="taco"
            windowLabel={getTacoWindowLabel(tacoAfterSetId)}
            isDragTarget={dragTargetId === "taco-card"}
          />
        ) : (
          <DropZone
            key={item.set.id}
            setId={item.set.id}
            isDragTarget={dragTargetId === `drop-${item.set.id}`}
          >
            <SetCard
              set={item.set}
              isFavorite={isFavorite(item.set.id)}
              onToggle={() => onToggleFavorite(item.set.id)}
              isActive={item.set.id === activeSetId}
            />
          </DropZone>
        ),
      )}
    </div>
  );
}
