# Charts

> **Status: data-driven components and examples done (2026-10-28).** shadcn upstream commit `96da9cc7f1aa10580a3741664e2a77c721206c00`. Related: [stack.md](stack.md) (S15), [pending.md](pending.md).

## 1. Decision

Charts use **Recharts v3** through the **shadcn chart wrapper**, and live in `src/components/charts/`. They are a separate entry point, `@danielsoaresf/lost-ui/charts`, and Recharts is an **optional peer** (`^3.0.0`), so an app that does not draw charts installs and bundles nothing extra. The root `lost-ui` entry does not export them.

## 2. Research

### Chart types

The shadcn charts cover the families below. All are Recharts primitives wrapped by the same `ChartContainer`.

| Family        | Folder          | Examples                                                                                                                        | Recharts primitives                                  |
| ------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Area          | `area-chart`    | 10: default, linear, step, stacked, stacked expanded, gradient, axes, legend, icons, interactive                                | `AreaChart`, `Area`                                  |
| Bar           | `bar-chart`     | 10: default, horizontal, multiple, stacked, mixed, label, custom label, negative, active, interactive                           | `BarChart`, `Bar`, `LabelList`                       |
| Line          | `line-chart`    | 10: default, linear, step, multiple, dots, custom dots, dot colours, label, custom label, interactive                           | `LineChart`, `Line`                                  |
| Pie and donut | `pie-chart`     | 11: simple, donut, donut with text, donut active, label, custom label, label list, legend, stacked, separator none, interactive | `PieChart`, `Pie`, `Cell`, `Sector`                  |
| Radar         | `radar-chart`   | 14: default, dots, multiple, lines only, grid variants (circle, filled, custom, none), radius axis, legend, icons, custom label | `RadarChart`, `Radar`, `PolarGrid`, `PolarAngleAxis` |
| Radial        | `radial-chart`  | 6: simple, label, grid, text, shape, stacked                                                                                    | `RadialBarChart`, `RadialBar`                        |
| Tooltip       | `chart-tooltip` | 9: default, indicator line, indicator none, label none, custom label, label formatter, formatter, icons, advanced               | `ChartTooltip`, `ChartTooltipContent`                |

Total: 70 examples in 7 folders, plus the core wrapper in `chart/`. Not covered by shadcn: scatter, composed (bar plus line), funnel, treemap, sankey, heatmap, gauge. Recharts itself supports scatter, composed, funnel, treemap and sankey, so they can be added on the same wrapper.

### Library options

| Library        | Strengths                                                                      | Why not for lost-ui                                                        |
| -------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| **Recharts 3** | React-first SVG, declarative, what shadcn builds on, themed with CSS variables | chosen                                                                     |
| visx           | Smallest footprint (about 49 kB gzip for its xychart entry), full control      | Low level: every chart is assembled by hand, no wrapper like shadcn's      |
| Nivo           | Many ready-made chart types, built-in theming                                  | Larger, and its own theme system would compete with our tokens             |
| Apache ECharts | Widest range of types, canvas for very large data                              | Configuration-driven rather than components, large bundle, not React-first |
| ApexCharts     | Rich features                                                                  | Licence restrictions above a revenue threshold (verify before use)         |
| Chart.js       | Canvas, popular                                                                | Canvas output cannot use CSS variables for theming                         |

Bundle sizes come from a single comparison written by a competing chart library, so treat them as rough. Recharts is about 150 to 170 kB gzip including its own dependencies; the optional-peer entry keeps that out of apps that do not use charts.

Sources: [shadcn/ui chart documentation](https://ui.shadcn.com/docs/components/chart); [LogRocket, top React chart libraries](https://blog.logrocket.com/top-5-react-chart-libraries/); [TanStack Charts comparison](https://tanstack.com/charts/latest/docs/framework/react/comparison); [WPDataTables comparison](https://wpdatatables.com/react-chart-libraries/).

### Why Recharts

- It is what shadcn's chart wrapper is built on, so the 70 official examples come for free and upstream updates stay portable.
- aura-creative already pins `recharts` 3.10.1, the version installed here.
- Theming is plain CSS: series colours are `var(--chart-1)` to `var(--chart-5)`, which the apps define per brand like any other token.

## 3. Layout

One component per folder, like the rest of the library. The shadcn `chart.tsx` (six components in one file) was split, and each chart family has a data-driven component on top of it.

```
src/components/charts/
  chart-container/        ChartContainer: sizing, scoped colour variables, context
  chart-style/            ChartStyle: emits the --color-<series> variables
  chart-tooltip/          ChartTooltip (the Recharts tooltip)
  chart-tooltip-content/  ChartTooltipContent + the 9 tooltip examples
  chart-legend/           ChartLegend (the Recharts legend)
  chart-legend-content/   ChartLegendContent
  chart-center-label/     ChartCenterLabel: the text in the middle of donut and radial charts
  chart-series/           buildSeriesConfig, seriesFromConfig, configLabel, palette helpers
  area-chart/ bar-chart/ line-chart/ pie-chart/ radar-chart/ radial-chart/
                          AreaChart ... RadialChart + examples/ (the official shadcn charts)
  lib/                    shared context, types and the payload helper (not exported)
```

## 4. The data-driven components

You pass data and props; the component builds the Recharts tree, the config, the tooltip and the legend.

```tsx
import { AreaChart } from "@danielsoaresf/lost-ui/charts";

<AreaChart
  data={visitors}
  xKey="month"
  series={[
    { key: "desktop", label: "Desktop" },
    { key: "mobile", label: "Mobile" },
  ]}
  stacked
  gradient
  showLegend
  xTickFormatter={(value) => value.slice(0, 3)}
/>;
```

Series colours default to `--chart-1..5` by position; a series can set its own `color` and `icon`. A shadcn `ChartConfig` converts with `seriesFromConfig(config)`.

| Component     | Data props                                | Main options                                                                                                                                         |
| ------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AreaChart`   | `data`, `xKey`, `series`                  | `curve`, `stacked`, `expand`, `gradient`, `showYAxis`                                                                                                |
| `BarChart`    | `data`, `xKey`, `series`                  | `orientation`, `stacked`, `radius`, `showLabels`, `labelKey`, `categoryInside`, `colorKey`, `negativeColor`, `activeIndex`                           |
| `LineChart`   | `data`, `xKey`, `series`                  | `curve`, `showDots`, `dotColorKey`, `renderDot`, `showLabels`, `labelKey`, `labelFormatter`, `strokeWidth`                                           |
| `PieChart`    | `data`, `nameKey`, `valueKey`             | `donut`, `centerLabel`, `inner` (second ring), `activeIndex`, `showLabels`, `labelPosition`, `labelFormatter`, `showSeparator`, `colorKey`, `config` |
| `RadarChart`  | `data`, `angleKey`, `series`              | `gridShape`, `showGrid`, `gridFilled`, `gridRadius`, `radialLines`, `filled`, `showDots`, `showRadiusAxis`, `angleTick`                              |
| `RadialChart` | `data`, `nameKey`, `valueKey` or `series` | `startAngle`, `endAngle`, `innerRadius`, `outerRadius`, `showGrid`, `gridRadius`, `showLabels`, `centerLabel`, `colorKey`, `config`                  |

Shared by all of them: `showGrid`, `showXAxis`, `xTickFormatter`, `xMinTickGap`, `showLegend`, `showTooltip`, `tooltipIndicator`, `tooltipProps` (any option of `ChartTooltipContent`, including `formatter` and `labelFormatter`), `animate` and `className`.

- `animate={false}` turns the entry animation off (reduced motion, printing, tests).
- The legend keeps the order of the series; the Recharts default sorts it alphabetically.
- When a chart cannot be described with props, compose the pieces yourself: `ChartContainer`, `ChartTooltip`, `ChartLegend` and the Recharts primitives stay available, as in shadcn.

### The examples

The 70 official shadcn examples are kept as recipes, under `Charts/Examples` in Storybook. They are **written with these components**: each one keeps the original data, card and copy, and the chart is a call with props. Where an example needed something the components did not offer, the prop was added (the right-hand columns above show what came from that). The 4 with state (area, bar, line, pie interactive) wrap the component in `useState`.

Usage with the low-level pieces, when needed:

```tsx
import { Bar, BarChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@danielsoaresf/lost-ui/charts";

const config = { desktop: { label: "Desktop", color: "var(--chart-1)" } } satisfies ChartConfig;

<ChartContainer config={config} className="min-h-[200px] w-full">
  <BarChart data={data}>
    <XAxis dataKey="month" />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" />
  </BarChart>
</ChartContainer>;
```

## 5. Theme tokens

`--chart-1` to `--chart-5` were added to `styles/theme-neutral.css` (light and dark) and mapped as `--color-chart-1..5` in `styles/styles.css`. An app that skips `theme-neutral.css` defines its own five values, the way it defines `--primary`.

## 6. Changes from upstream

- `"use client"` removed; `cn` comes from `../../lib/cn`; `card` and `select` from the library's own primitives.
- Recharts 3.10.1 types reject a `className` on `ChartLegend`. In 3 examples (pie legend, radar icons, radar legend) it moved to `ChartLegendContent`, which is where the classes apply.
- `labelFormatter` receives a `ReactNode` in these types; 16 examples cast it with `value as string` before `new Date(...)`.
- Label render functions that returned nothing on one branch now return `null` (5 examples), and 6 unused imports were removed.
- Line endings normalised from CRLF to LF.

## 7. Verification

- `tsc --noEmit`, `vite build` and Prettier pass.
- Every component has stories and tests. The abstract components are tested against the real Recharts DOM (areas, bars, lines, slices, rings, dots, labels, grid, axes, legend order, centre label, config labels). The tests replace `ResponsiveContainer` with a fixed size and pass `animate={false}`, because jsdom does not measure layout and Recharts only draws after measuring; they prove structure and behaviour, not geometry.
- All 70 examples render through the components and are checked for a `[data-slot="chart"]` and an SVG surface.
- A packed tarball installs in an empty project: `@danielsoaresf/lost-ui/charts` exports the components and helpers, and the root entry exports none of them.
- Storybook: chart stories open in headless Chromium with no console or page errors. Dark mode was not checked.
