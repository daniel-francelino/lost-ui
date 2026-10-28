import type { ComponentType, ReactNode } from "react";

import type { ChartConfig } from "./chart-context";

export type ChartRow = Record<string, unknown>;

export type ChartSeries = {
  key: string;
  label?: ReactNode;
  color?: string;
  icon?: ComponentType;
};

export type TooltipIndicator = "dot" | "line" | "dashed";

export type CenterLabel = {
  value: string | number;
  caption?: string;
};

export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export function paletteColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length] ?? CHART_COLORS[0];
}

export function seriesFill(key: string): string {
  return `var(--color-${key})`;
}

export function buildSeriesConfig(series: ChartSeries[]): ChartConfig {
  return Object.fromEntries(
    series.map((item, index) => [
      item.key,
      {
        label: item.label ?? item.key,
        color: item.color ?? paletteColor(index),
        ...(item.icon ? { icon: item.icon } : {}),
      },
    ]),
  );
}

export function buildSliceConfig(rows: ChartRow[], nameKey: string, colorKey?: string): ChartConfig {
  return Object.fromEntries(
    rows.map((row, index) => {
      const name = String(row[nameKey]);
      const color = colorKey ? row[colorKey] : undefined;
      return [name, { label: name, color: typeof color === "string" ? color : paletteColor(index) }];
    }),
  );
}

export function sliceColor(row: ChartRow, index: number, colorKey?: string): string {
  const color = colorKey ? row[colorKey] : undefined;
  return typeof color === "string" ? color : paletteColor(index);
}
