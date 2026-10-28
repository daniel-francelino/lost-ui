import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { FormOptionList } from "./form-option-list";

const items = [
  { value: "a", label: "Alpha", description: "First letter" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma", disabled: true },
];

const meta = {
  title: "Forms/FormOptionList",
  component: FormOptionList,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { id: "options", items, selected: ["a"], onSelect: fn(), onActiveChange: fn() },
  decorators: [
    (Story) => (
      <div className="w-64 rounded-md border p-1">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormOptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithActiveOption: Story = { args: { activeIndex: 1 } };

export const Multiple: Story = { args: { multiple: true, selected: ["a", "b"] } };

export const Empty: Story = { args: { items: [], emptyText: "Nothing found" } };
