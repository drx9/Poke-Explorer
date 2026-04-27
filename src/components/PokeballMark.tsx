import { cn } from "@/lib/cn";

export function PokeballMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("h-9 w-9", className)}
      fill="none"
    >
      <circle cx="32" cy="32" r="28" className="fill-white" />
      <path d="M4 32a28 28 0 0 1 56 0H4Z" className="fill-red-500" />
      <path d="M4 32h56" className="stroke-zinc-900" strokeWidth="6" strokeLinecap="round" />
      <circle cx="32" cy="32" r="10" className="fill-white stroke-zinc-900" strokeWidth="6" />
      <circle cx="32" cy="32" r="4" className="fill-zinc-900" />
    </svg>
  );
}

