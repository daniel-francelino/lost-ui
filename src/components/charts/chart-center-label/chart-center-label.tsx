export type ChartCenterLabelProps = {
  viewBox?: unknown;
  value: string | number;
  caption?: string;
};

function readCenter(viewBox: unknown): { cx: number; cy: number } | null {
  if (typeof viewBox !== "object" || viewBox === null) return null;
  if (!("cx" in viewBox) || !("cy" in viewBox)) return null;
  const { cx, cy } = viewBox;
  if (typeof cx !== "number" || typeof cy !== "number") return null;
  return { cx, cy };
}

export function ChartCenterLabel({ viewBox, value, caption }: ChartCenterLabelProps) {
  const center = readCenter(viewBox);

  if (!center) {
    return null;
  }

  return (
    <text x={center.cx} y={center.cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={center.cx} y={center.cy} className="fill-foreground text-3xl font-bold">
        {typeof value === "number" ? value.toLocaleString() : value}
      </tspan>
      {caption && (
        <tspan x={center.cx} y={center.cy + 24} className="fill-muted-foreground">
          {caption}
        </tspan>
      )}
    </text>
  );
}
