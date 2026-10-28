import type { Meta, StoryObj } from "@storybook/react-vite";

import { FormField } from "./form-field";

const ids = {
  id: "demo",
  labelId: "demo-label",
  descriptionId: "demo-description",
  helpId: "demo-help",
  errorId: "demo-error",
};

const meta = {
  title: "Forms/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    ids,
    label: "Username",
    children: (
      <input id="demo" className="h-9 w-full rounded-md border border-input px-3 text-sm" />
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { description: "Shown to everyone.", hint: "Required", help: "Use letters and digits." },
};

export const Required: Story = { args: { required: true } };

export const WithError: Story = {
  args: { invalid: true, errorMessage: "That username is taken", help: "Use letters and digits." },
};

export const Horizontal: Story = {
  args: { orientation: "horizontal", description: "Public name" },
};

export const Disabled: Story = { args: { disabled: true } };

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {(["xs", "md", "xl"] as const).map((size) => (
        <FormField
          key={size}
          {...args}
          size={size}
          label={`Size ${size}`}
          ids={{ ...ids, id: size }}
        >
          <input id={size} className="h-9 w-full rounded-md border border-input px-3" />
        </FormField>
      ))}
    </div>
  ),
};
