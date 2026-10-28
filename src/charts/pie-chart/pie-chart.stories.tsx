import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartPieDonutActive } from "./examples/chart-pie-donut-active";
import chartPieDonutActiveSource from "./examples/chart-pie-donut-active.tsx?raw";
import { ChartPieDonutText } from "./examples/chart-pie-donut-text";
import chartPieDonutTextSource from "./examples/chart-pie-donut-text.tsx?raw";
import { ChartPieDonut } from "./examples/chart-pie-donut";
import chartPieDonutSource from "./examples/chart-pie-donut.tsx?raw";
import { ChartPieInteractive } from "./examples/chart-pie-interactive";
import chartPieInteractiveSource from "./examples/chart-pie-interactive.tsx?raw";
import { ChartPieLabelCustom } from "./examples/chart-pie-label-custom";
import chartPieLabelCustomSource from "./examples/chart-pie-label-custom.tsx?raw";
import { ChartPieLabelList } from "./examples/chart-pie-label-list";
import chartPieLabelListSource from "./examples/chart-pie-label-list.tsx?raw";
import { ChartPieLabel } from "./examples/chart-pie-label";
import chartPieLabelSource from "./examples/chart-pie-label.tsx?raw";
import { ChartPieLegend } from "./examples/chart-pie-legend";
import chartPieLegendSource from "./examples/chart-pie-legend.tsx?raw";
import { ChartPieSeparatorNone } from "./examples/chart-pie-separator-none";
import chartPieSeparatorNoneSource from "./examples/chart-pie-separator-none.tsx?raw";
import { ChartPieSimple } from "./examples/chart-pie-simple";
import chartPieSimpleSource from "./examples/chart-pie-simple.tsx?raw";
import { ChartPieStacked } from "./examples/chart-pie-stacked";
import chartPieStackedSource from "./examples/chart-pie-stacked.tsx?raw";

const meta = {
  title: "Charts/Pie",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

export const DonutActive: StoryObj = {
  render: () => <ChartPieDonutActive />,
  parameters: { docs: { source: { code: chartPieDonutActiveSource, language: "tsx" } } },
};

export const DonutText: StoryObj = {
  render: () => <ChartPieDonutText />,
  parameters: { docs: { source: { code: chartPieDonutTextSource, language: "tsx" } } },
};

export const Donut: StoryObj = {
  render: () => <ChartPieDonut />,
  parameters: { docs: { source: { code: chartPieDonutSource, language: "tsx" } } },
};

export const Interactive: StoryObj = {
  render: () => <ChartPieInteractive />,
  parameters: { docs: { source: { code: chartPieInteractiveSource, language: "tsx" } } },
};

export const LabelCustom: StoryObj = {
  render: () => <ChartPieLabelCustom />,
  parameters: { docs: { source: { code: chartPieLabelCustomSource, language: "tsx" } } },
};

export const LabelList: StoryObj = {
  render: () => <ChartPieLabelList />,
  parameters: { docs: { source: { code: chartPieLabelListSource, language: "tsx" } } },
};

export const Label: StoryObj = {
  render: () => <ChartPieLabel />,
  parameters: { docs: { source: { code: chartPieLabelSource, language: "tsx" } } },
};

export const Legend: StoryObj = {
  render: () => <ChartPieLegend />,
  parameters: { docs: { source: { code: chartPieLegendSource, language: "tsx" } } },
};

export const SeparatorNone: StoryObj = {
  render: () => <ChartPieSeparatorNone />,
  parameters: { docs: { source: { code: chartPieSeparatorNoneSource, language: "tsx" } } },
};

export const Simple: StoryObj = {
  render: () => <ChartPieSimple />,
  parameters: { docs: { source: { code: chartPieSimpleSource, language: "tsx" } } },
};

export const Stacked: StoryObj = {
  render: () => <ChartPieStacked />,
  parameters: { docs: { source: { code: chartPieStackedSource, language: "tsx" } } },
};
