import { cn } from "@/lib/cn";
import { typePillClass } from "@/lib/pokemonColors";

export function TypePill({ type, className }: { type: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize shadow-sm",
        typePillClass(type),
        className,
      )}
    >
      {type}
    </span>
  );
}

