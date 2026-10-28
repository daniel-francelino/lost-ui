# Charts

> **Status: imported and building (2026-10-28).** shadcn upstream commit `96da9cc7f1aa10580a3741664e2a77c721206c00`. Related: [stack.md](stack.md) (S15), [pending.md](pending.md).

## 1. Decision

Charts use **Recharts v3** through the **shadcn chart wrapper**, and live in `src/charts/`. They are a separate entry point, `lost-ui/charts`, and Recharts is an **optional peer** (`^3.0.0`), so an app that does not draw charts installs and bundles nothing extra. The root `lost-ui` entry does not export them.

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

```
src/charts/
  chart/             the wrapper: ChartContainer, ChartTooltip(Content), ChartLegend(Content), ChartStyle
  area-chart/        examples/ (10 files), area-chart.stories.tsx, area-chart.test.tsx
  bar-chart/ line-chart/ pie-chart/ radar-chart/ radial-chart/ chart-tooltip/   (same shape)
```

Only `chart/` is code the library exports. The family folders hold the official examples as stories and tests. They are not exported, because each example is a finished card with hard-coded data, meant to be copied and adapted. A data-driven API (`<AreaChart data series />`) would be a separate design decision; see [pending.md](pending.md).

Usage:

```tsx
import { Bar, BarChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "lost-ui/charts";

const config = { desktop: { label: "Desktop", color: "var(--chart-1)" } } satisfies ChartConfig;

<ChartContainer config={config} className="min-h-[200px] w-full">
  <BarChart data={data}>
    <XAxis dataKey="month" />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" />
  </BarChart>
</ChartContainer>;
```

## 4. Theme tokens

`--chart-1` to `--chart-5` were added to `styles/theme-neutral.css` (light and dark) and mapped as `--color-chart-1..5` in `styles/styles.css`. An app that skips `theme-neutral.css` defines its own five values, the way it defines `--primary`.

## 5. Changes from upstream

- `"use client"` removed; `cn` comes from `../../lib/cn`; `card` and `select` from the library's own primitives.
- Recharts 3.10.1 types reject a `className` on `ChartLegend`. In 3 examples (pie legend, radar icons, radar legend) it moved to `ChartLegendContent`, which is where the classes apply.
- `labelFormatter` receives a `ReactNode` in these types; 16 examples cast it with `value as string` before `new Date(...)`.
- Label render functions that returned nothing on one branch now return `null` (5 examples), and 6 unused imports were removed.
- Line endings normalised from CRLF to LF.

## 6. Verification

- `tsc --noEmit`, `vite build` and Prettier pass.
- 8 test files, 74 tests, all passing. Each example is rendered and must produce a `[data-slot="chart"]` element. `chart.test.tsx` also checks that series colours become CSS variables, that light and dark theme colours are scoped separately, and that each chart has its own scoped id. jsdom does not lay out SVG, so the tests prove structure, not geometry.
- A packed tarball installs in an empty project: `lost-ui/charts` exports the 6 wrapper symbols, the root entry exports none of them, and the chart tokens reach the compiled CSS.
- Storybook: 72 chart stories open in headless Chromium with no console or page errors. Area, bar, radar and radial families were checked by eye in a light theme. Dark mode was not checked.
