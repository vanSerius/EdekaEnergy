import { cn } from "@/lib/cn";

export function EdekaMark({
  size = 36,
  className,
  variant = "default",
}: {
  size?: number;
  className?: string;
  variant?: "default" | "mono";
}) {
  const bg = variant === "mono" ? "#0E1B33" : "#FFD500";
  const fg = variant === "mono" ? "#FBF8F1" : "#003D8F";
  const h = size;
  const w = size * 2.1;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 210 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="EDEKA"
    >
      <rect width="210" height="100" rx="14" fill={bg} />
      <text
        x="105"
        y="68"
        textAnchor="middle"
        fontFamily="Bricolage Grotesque, ui-serif, serif"
        fontWeight="700"
        fontSize="52"
        letterSpacing="2"
        fill={fg}
      >
        EDEKA
      </text>
    </svg>
  );
}

export function EdekaWordmarkInline({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-md bg-edeka-yellow px-1.5 py-0.5 font-display font-bold tracking-wider text-edeka-blue",
        className,
      )}
    >
      EDEKA
    </span>
  );
}
