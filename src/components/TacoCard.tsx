import { useDraggable } from "@dnd-kit/core";

interface TacoCardProps {
  windowLabel: string;
  isDragTarget: boolean;
}

export default function TacoCard({ windowLabel, isDragTarget }: TacoCardProps) {
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: "taco-card",
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      className={`rounded-xl border-2 border-dashed transition-colors cursor-grab active:cursor-grabbing select-none ${
        isDragging ? "opacity-50" : ""
      } ${
        isDragTarget
          ? "border-zinc-600/40 bg-zinc-800/15"
          : "border-zinc-700/30 bg-zinc-900/60 hover:border-zinc-600/40"
      }`}
      aria-label="Taco break — drag to move in the schedule"
    >
      <div className="flex items-center gap-4 px-4 py-4">
        {/* Taco icon */}
        <div
          className="w-14 h-14 rounded-lg shrink-0 bg-zinc-800/30 flex items-center justify-center text-3xl select-none"
          aria-hidden="true"
        >
          🌮
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-zinc-500/70 mb-0.5 uppercase tracking-widest font-bold">
            Taco Break
          </p>
          <p className="font-display text-zinc-300 text-lg leading-tight">
            Shove-It Tacos
          </p>
          {windowLabel && (
            <p className="mt-1 text-xs text-zinc-400 tabular-nums">
              {windowLabel}
            </p>
          )}
        </div>

        {/* Drag handle */}
        <div
          className="shrink-0 text-zinc-600 flex flex-col gap-0.5 px-1"
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
