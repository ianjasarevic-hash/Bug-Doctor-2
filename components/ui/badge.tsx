import * as React from "react";

type Tone =
  | "neutral"
  | "easy"
  | "medium"
  | "hard"
  | "impossible"
  | "success"
  | "warn"
  | "danger"
  | "brand";

// Difficulty palette — see tailwind.config.ts (diffEasy/Medium/Hard/Impossible).
// Consistent across problem cards, score card, role cards.
const tones: Record<Tone, string> = {
  neutral: "border-border text-muted",
  easy: "border-diffEasy/40 text-diffEasy",
  medium: "border-diffMedium/40 text-diffMedium",
  hard: "border-diffHard/40 text-diffHard",
  impossible: "border-diffImpossible/40 text-diffImpossible",
  success: "border-success/40 text-success",
  warn: "border-warning/40 text-warning",
  danger: "border-danger/40 text-danger",
  brand: "border-action/40 text-action",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider border bg-surface ${tones[tone]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </span>
  );
}