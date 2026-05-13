"use client";

interface SparkLineProps {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fillFrom?: string;
  fillTo?: string;
  className?: string;
  showDots?: boolean;
  baseline?: boolean;
  dotFill?: string;
}

export function SparkLine({
  values,
  width = 480,
  height = 140,
  stroke = "#003D8F",
  fillFrom = "rgba(255,213,0,0.55)",
  fillTo = "rgba(255,213,0,0)",
  dotFill = "#FFD500",
  className,
  showDots = true,
  baseline = true,
}: SparkLineProps) {
  if (values.length === 0) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const padX = 4;
  const padTop = 8;
  const padBottom = 10;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;

  const pts = values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * innerW;
    const y = padTop + (1 - (v - min) / range) * innerH;
    return [x, y] as const;
  });

  // Catmull-Rom-ish smooth path
  function smoothPath(p: readonly (readonly [number, number])[]): string {
    if (p.length < 2) return "";
    let d = `M ${p[0][0]} ${p[0][1]}`;
    for (let i = 0; i < p.length - 1; i++) {
      const [x0, y0] = p[Math.max(0, i - 1)];
      const [x1, y1] = p[i];
      const [x2, y2] = p[i + 1];
      const [x3, y3] = p[Math.min(p.length - 1, i + 2)];
      const cp1x = x1 + (x2 - x0) / 6;
      const cp1y = y1 + (y2 - y0) / 6;
      const cp2x = x2 - (x3 - x1) / 6;
      const cp2y = y2 - (y3 - y1) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
    }
    return d;
  }

  const linePath = smoothPath(pts);
  const fillPath = `${linePath} L ${pts[pts.length - 1][0]} ${padTop + innerH} L ${pts[0][0]} ${padTop + innerH} Z`;

  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      className={className}
    >
      <defs>
        <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillFrom} />
          <stop offset="100%" stopColor={fillTo} />
        </linearGradient>
      </defs>
      {baseline && (
        <line
          x1={padX}
          x2={width - padX}
          y1={height - padBottom + 0.5}
          y2={height - padBottom + 0.5}
          stroke="rgba(14,27,51,0.10)"
          strokeDasharray="3 4"
        />
      )}
      <path d={fillPath} fill="url(#sparkfill)" />
      <path d={linePath} fill="none" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" />
      {showDots && (
        <>
          <circle cx={last[0]} cy={last[1]} r={6} fill={dotFill} stroke={stroke} strokeWidth={2} />
          <circle cx={last[0]} cy={last[1]} r={11} fill="none" stroke={dotFill} strokeOpacity={0.4}>
            <animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}
