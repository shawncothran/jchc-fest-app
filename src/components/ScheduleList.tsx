import type { ScheduleSet } from "../data/schedule";
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
  onPlayVideo?: (set: ScheduleSet) => void;
  /** True only when the taco has moved to a new slot - shows ghost placeholder */
  showGhost?: boolean;
}

export default function ScheduleList({
  items,
  tacoAfterSetId,
  activeSetId,
  isFavorite,
  onToggleFavorite,
  onPlayVideo,
  showGhost,
}: ScheduleListProps) {
  return (
    <div className="flex flex-col gap-3.5">
      {items.map((item) =>
        item.type === "taco" ? (
          showGhost ? (
            // Ghost placeholder at destination - same size/content as real card
            <TacoCard
              key="taco"
              windowLabel={getTacoWindowLabel(tacoAfterSetId)}
              ghost
            />
          ) : (
            <TacoCard
              key="taco"
              windowLabel={getTacoWindowLabel(tacoAfterSetId)}
            />
          )
        ) : (
          <DropZone key={item.set.id} setId={item.set.id}>
            <SetCard
              set={item.set}
              isFavorite={isFavorite(item.set.id)}
              onToggle={() => onToggleFavorite(item.set.id)}
              onPlayVideo={
                onPlayVideo ? () => onPlayVideo(item.set) : undefined
              }
              isActive={item.set.id === activeSetId}
            />
          </DropZone>
        )
      )}
    </div>
  );
}
