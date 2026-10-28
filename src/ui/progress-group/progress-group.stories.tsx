import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProgressGroup, type ProgressGroupItem } from "./progress-group";

const storage: ProgressGroupItem[] = [
  { label: "Documents", value: 30, color: "primary" },
  { label: "Photos", value: 25, color: "success" },
  { label: "Videos", value: 15, color: "warning" },
];

const meta = {
  title: "UI/ProgressGroup",
  component: ProgressGroup,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { items: storage, label: "Storage", className: "w-96" },
} satisfies Meta<typeof ProgressGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithStatus: Story = { args: { status: true } };

export const CustomStatus: Story = {
  args: {
    status: (total, percent) => `${total} of 100 GB used (${Math.round(percent)}%)`,
  },
};

export const CustomColors: Story = {
  args: {
    items: [
      { label: "Input tokens", value: 40, color: "#4f46e5" },
      { label: "Output tokens", value: 20, color: "oklch(0.7 0.2 150)" },
      { label: "Cached", value: 10, color: "tomato" },
    ],
    max: 100,
  },
};

export const NoLegend: Story = { args: { legend: false } };

export const OverMax: Story = {
  args: {
    items: [
      { label: "A", value: 80 },
      { label: "B", value: 60, color: "info" },
    ],
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-6">
      {(["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const).map((size) => (
        <ProgressGroup key={size} {...args} size={size} legend={false} />
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical", size: "lg", className: "h-48", status: true },
};

export const CustomLegend: Story = {
  args: {
    renderLabel: ({ item, percent }) => (
      <span>
        {item.label} <small>({Math.round(percent)}%)</small>
      </span>
    ),
    renderTrailing: ({ item }) => `${item.value} GB`,
  },
};
