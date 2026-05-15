import { useDraggable } from "@dnd-kit/core";
import CardRow, {
  cardIconCx,
  cardMetaCx,
  cardTextStackCx,
  cardTimeCx,
  cardTitleCx,
} from "./CardRow";

interface TacoCardProps {
  windowLabel: string;
  overlay?: boolean;
  ghost?: boolean;
}

export default function TacoCard({
  windowLabel,
  overlay,
  ghost,
}: TacoCardProps) {
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: "taco-card",
  });
  return (
    <div
      ref={overlay || ghost ? undefined : setNodeRef}
      {...(overlay || ghost ? {} : listeners)}
      style={{ touchAction: "none" }}
      className={`rounded-xl border-[3px] border-dashed border-zinc-700/50 bg-zinc-950 transition-colors select-none ${
        ghost
          ? "opacity-30 pointer-events-none"
          : overlay
            ? "shadow-2xl rotate-1 scale-105 opacity-95 cursor-grabbing"
            : isDragging
              ? "opacity-20 cursor-grab active:cursor-grabbing hover:border-zinc-600/40"
              : "cursor-grab active:cursor-grabbing hover:border-zinc-600/40"
      }`}
      aria-label="Taco break — drag to move in the schedule"
    >
      <CardRow>
        <div
          className={`${cardIconCx} bg-zinc-800 flex items-center justify-center p-1`}
        >
          <img
            src="/logos/shove-it-tacos.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain"
          />
        </div>

        <div className={`${cardTextStackCx} flex-1 min-w-0`}>
          <p className={cardTimeCx}>{windowLabel}</p>
          <h2 className={`${cardTitleCx} tracking-tighter`}>Taco Break 🌮</h2>
          <p className={cardMetaCx}>Shove-It Tacos</p>
        </div>

        <div
          className="shrink-0 w-8 sm:w-9 flex flex-col gap-0.5 px-1 items-center justify-center"
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-zinc-600" />
              <div className="w-1 h-1 rounded-full bg-zinc-600" />
            </div>
          ))}
        </div>
      </CardRow>
    </div>
  );
}
