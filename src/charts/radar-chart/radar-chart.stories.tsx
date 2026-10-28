import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartRadarDefault } from "./examples/chart-radar-default";
import chartRadarDefaultSource from "./examples/chart-radar-default.tsx?raw";
import { ChartRadarDots } from "./examples/chart-radar-dots";
import chartRadarDotsSource from "./examples/chart-radar-dots.tsx?raw";
import { ChartRadarGridCircleFill } from "./examples/chart-radar-grid-circle-fill";
import chartRadarGridCircleFillSource from "./examples/chart-radar-grid-circle-fill.tsx?raw";
import { ChartRadarGridCircleNoLines } from "./examples/chart-radar-grid-circle-no-lines";
import chartRadarGridCircleNoLinesSource from "./examples/chart-radar-grid-circle-no-lines.tsx?raw";
import { ChartRadarGridCircle } from "./examples/chart-radar-grid-circle";
import chartRadarGridCircleSource from "./examples/chart-radar-grid-circle.tsx?raw";
import { ChartRadarGridCustom } from "./examples/chart-radar-grid-custom";
import chartRadarGridCustomSource from "./examples/chart-radar-grid-custom.tsx?raw";
import { ChartRadarGridFill } from "./examples/chart-radar-grid-fill";
import chartRadarGridFillSource from "./examples/chart-radar-grid-fill.tsx?raw";
import { ChartRadarGridNone } from "./examples/chart-radar-grid-none";
import chartRadarGridNoneSource from "./examples/chart-radar-grid-none.tsx?raw";
import { ChartRadarIcons } from "./examples/chart-radar-icons";
import chartRadarIconsSource from "./examples/chart-radar-icons.tsx?raw";
import { ChartRadarLabelCustom } from "./examples/chart-radar-label-custom";
import chartRadarLabelCustomSource from "./examples/chart-radar-label-custom.tsx?raw";
import { ChartRadarLegend } from "./examples/chart-radar-legend";
import chartRadarLegendSource from "./examples/chart-radar-legend.tsx?raw";
import { ChartRadarLinesOnly } from "./examples/chart-radar-lines-only";
import chartRadarLinesOnlySource from "./examples/chart-radar-lines-only.tsx?raw";
import { ChartRadarMultiple } from "./examples/chart-radar-multiple";
import chartRadarMultipleSource from "./examples/chart-radar-multiple.tsx?raw";
import { ChartRadarRadius } from "./examples/chart-radar-radius";
import chartRadarRadiusSource from "./examples/chart-radar-radius.tsx?raw";

const meta = {
  title: "Charts/Radar",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

export const Default: StoryObj = {
  render: () => <ChartRadarDefault />,
  parameters: { docs: { source: { code: chartRadarDefaultSource, language: "tsx" } } },
};

export const Dots: StoryObj = {
  render: () => <ChartRadarDots />,
  parameters: { docs: { source: { code: chartRadarDotsSource, language: "tsx" } } },
};

export const GridCircleFill: StoryObj = {
  render: () => <ChartRadarGridCircleFill />,
  parameters: { docs: { source: { code: chartRadarGridCircleFillSource, language: "tsx" } } },
};

export const GridCircleNoLines: StoryObj = {
  render: () => <ChartRadarGridCircleNoLines />,
  parameters: { docs: { source: { code: chartRadarGridCircleNoLinesSource, language: "tsx" } } },
};

export const GridCircle: StoryObj = {
  render: () => <ChartRadarGridCircle />,
  parameters: { docs: { source: { code: chartRadarGridCircleSource, language: "tsx" } } },
};

export const GridCustom: StoryObj = {
  render: () => <ChartRadarGridCustom />,
  parameters: { docs: { source: { code: chartRadarGridCustomSource, language: "tsx" } } },
};

export const GridFill: StoryObj = {
  render: () => <ChartRadarGridFill />,
  parameters: { docs: { source: { code: chartRadarGridFillSource, language: "tsx" } } },
};

export const GridNone: StoryObj = {
  render: () => <ChartRadarGridNone />,
  parameters: { docs: { source: { code: chartRadarGridNoneSource, language: "tsx" } } },
};

export const Icons: StoryObj = {
  render: () => <ChartRadarIcons />,
  parameters: { docs: { source: { code: chartRadarIconsSource, language: "tsx" } } },
};

export const LabelCustom: StoryObj = {
  render: () => <ChartRadarLabelCustom />,
  parameters: { docs: { source: { code: chartRadarLabelCustomSource, language: "tsx" } } },
};

export const Legend: StoryObj = {
  render: () => <ChartRadarLegend />,
  parameters: { docs: { source: { code: chartRadarLegendSource, language: "tsx" } } },
};

export const LinesOnly: StoryObj = {
  render: () => <ChartRadarLinesOnly />,
  parameters: { docs: { source: { code: chartRadarLinesOnlySource, language: "tsx" } } },
};

export const Multiple: StoryObj = {
  render: () => <ChartRadarMultiple />,
  parameters: { docs: { source: { code: chartRadarMultipleSource, language: "tsx" } } },
};

export const Radius: StoryObj = {
  render: () => <ChartRadarRadius />,
  parameters: { docs: { source: { code: chartRadarRadiusSource, language: "tsx" } } },
};
