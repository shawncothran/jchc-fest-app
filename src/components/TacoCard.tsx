import { useDraggable } from "@dnd-kit/core";

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
      className={`rounded-xl border-2 border-dashed border-zinc-700/30 bg-zinc-900/60 transition-colors select-none ${
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
      <div className="flex items-center gap-3 px-3 py-3">
        {/* Taco icon — same size as band image in SetCard */}
        <div
          className="w-12 h-12 rounded-lg shrink-0 bg-zinc-800/30 flex items-center justify-center text-2xl select-none"
          aria-hidden="true"
        >
          🌮
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-zinc-500 tabular-nums">{windowLabel}</p>
          <h2 className="font-display text-white text-sm leading-tight tracking-tighter truncate">
            Shove-It Tacos
          </h2>
          <p className="text-xs text-zinc-500 leading-snug">Taco Break</p>
        </div>

        {/* Drag handle */}
        <div
          className="shrink-0 w-9 text-zinc-600 flex flex-col gap-0.5 px-1 items-center justify-center"
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-zinc-600" />
              <div className="w-1 h-1 rounded-full bg-zinc-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
