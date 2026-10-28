import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartAreaAxes } from "./examples/chart-area-axes";
import chartAreaAxesSource from "./examples/chart-area-axes.tsx?raw";
import { ChartAreaDefault } from "./examples/chart-area-default";
import chartAreaDefaultSource from "./examples/chart-area-default.tsx?raw";
import { ChartAreaGradient } from "./examples/chart-area-gradient";
import chartAreaGradientSource from "./examples/chart-area-gradient.tsx?raw";
import { ChartAreaIcons } from "./examples/chart-area-icons";
import chartAreaIconsSource from "./examples/chart-area-icons.tsx?raw";
import { ChartAreaInteractive } from "./examples/chart-area-interactive";
import chartAreaInteractiveSource from "./examples/chart-area-interactive.tsx?raw";
import { ChartAreaLegend } from "./examples/chart-area-legend";
import chartAreaLegendSource from "./examples/chart-area-legend.tsx?raw";
import { ChartAreaLinear } from "./examples/chart-area-linear";
import chartAreaLinearSource from "./examples/chart-area-linear.tsx?raw";
import { ChartAreaStackedExpand } from "./examples/chart-area-stacked-expand";
import chartAreaStackedExpandSource from "./examples/chart-area-stacked-expand.tsx?raw";
import { ChartAreaStacked } from "./examples/chart-area-stacked";
import chartAreaStackedSource from "./examples/chart-area-stacked.tsx?raw";
import { ChartAreaStep } from "./examples/chart-area-step";
import chartAreaStepSource from "./examples/chart-area-step.tsx?raw";

const meta = {
  title: "Charts/Examples/Area",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

export const Axes: StoryObj = {
  render: () => <ChartAreaAxes />,
  parameters: { docs: { source: { code: chartAreaAxesSource, language: "tsx" } } },
};

export const Default: StoryObj = {
  render: () => <ChartAreaDefault />,
  parameters: { docs: { source: { code: chartAreaDefaultSource, language: "tsx" } } },
};

export const Gradient: StoryObj = {
  render: () => <ChartAreaGradient />,
  parameters: { docs: { source: { code: chartAreaGradientSource, language: "tsx" } } },
};

export const Icons: StoryObj = {
  render: () => <ChartAreaIcons />,
  parameters: { docs: { source: { code: chartAreaIconsSource, language: "tsx" } } },
};

export const Interactive: StoryObj = {
  render: () => <ChartAreaInteractive />,
  parameters: { docs: { source: { code: chartAreaInteractiveSource, language: "tsx" } } },
};

export const Legend: StoryObj = {
  render: () => <ChartAreaLegend />,
  parameters: { docs: { source: { code: chartAreaLegendSource, language: "tsx" } } },
};

export const Linear: StoryObj = {
  render: () => <ChartAreaLinear />,
  parameters: { docs: { source: { code: chartAreaLinearSource, language: "tsx" } } },
};

export const StackedExpand: StoryObj = {
  render: () => <ChartAreaStackedExpand />,
  parameters: { docs: { source: { code: chartAreaStackedExpandSource, language: "tsx" } } },
};

export const Stacked: StoryObj = {
  render: () => <ChartAreaStacked />,
  parameters: { docs: { source: { code: chartAreaStackedSource, language: "tsx" } } },
};

export const Step: StoryObj = {
  render: () => <ChartAreaStep />,
  parameters: { docs: { source: { code: chartAreaStepSource, language: "tsx" } } },
};
