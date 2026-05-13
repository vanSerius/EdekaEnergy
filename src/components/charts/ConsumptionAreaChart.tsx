"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatkWh } from "@/lib/formatters";

export interface ChartPoint {
  label: string;
  current: number;
  previous?: number;
}

export function ConsumptionAreaChart({ data, height = 320 }: { data: ChartPoint[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="grad-current" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD500" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#FFD500" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(10,14,26,0.06)" strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="rgba(10,14,26,0.0)"
          tickLine={false}
          axisLine={false}
          dy={6}
          interval="preserveStartEnd"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          tickFormatter={v => `${Math.round(v)}`}
        />
        <Tooltip
          formatter={(v: number, name: string) => [formatkWh(v, { digits: 0 }), name === "current" ? "Aktuell" : "Vorperiode"]}
          labelFormatter={l => `${l}`}
        />
        <Area
          type="monotone"
          dataKey="current"
          stroke="#001A4D"
          strokeWidth={2.6}
          fill="url(#grad-current)"
          activeDot={{ r: 5, fill: "#FFD500", stroke: "#001A4D", strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="previous"
          stroke="#8089A0"
          strokeWidth={1.6}
          strokeDasharray="4 5"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
