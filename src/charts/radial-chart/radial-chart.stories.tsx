import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartRadialGrid } from "./examples/chart-radial-grid";
import chartRadialGridSource from "./examples/chart-radial-grid.tsx?raw";
import { ChartRadialLabel } from "./examples/chart-radial-label";
import chartRadialLabelSource from "./examples/chart-radial-label.tsx?raw";
import { ChartRadialShape } from "./examples/chart-radial-shape";
import chartRadialShapeSource from "./examples/chart-radial-shape.tsx?raw";
import { ChartRadialSimple } from "./examples/chart-radial-simple";
import chartRadialSimpleSource from "./examples/chart-radial-simple.tsx?raw";
import { ChartRadialStacked } from "./examples/chart-radial-stacked";
import chartRadialStackedSource from "./examples/chart-radial-stacked.tsx?raw";
import { ChartRadialText } from "./examples/chart-radial-text";
import chartRadialTextSource from "./examples/chart-radial-text.tsx?raw";

const meta = {
  title: "Charts/Radial",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

export const Grid: StoryObj = {
  render: () => <ChartRadialGrid />,
  parameters: { docs: { source: { code: chartRadialGridSource, language: "tsx" } } },
};

export const Label: StoryObj = {
  render: () => <ChartRadialLabel />,
  parameters: { docs: { source: { code: chartRadialLabelSource, language: "tsx" } } },
};

export const Shape: StoryObj = {
  render: () => <ChartRadialShape />,
  parameters: { docs: { source: { code: chartRadialShapeSource, language: "tsx" } } },
};

export const Simple: StoryObj = {
  render: () => <ChartRadialSimple />,
  parameters: { docs: { source: { code: chartRadialSimpleSource, language: "tsx" } } },
};

export const Stacked: StoryObj = {
  render: () => <ChartRadialStacked />,
  parameters: { docs: { source: { code: chartRadialStackedSource, language: "tsx" } } },
};

export const Text: StoryObj = {
  render: () => <ChartRadialText />,
  parameters: { docs: { source: { code: chartRadialTextSource, language: "tsx" } } },
};
