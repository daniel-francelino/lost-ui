import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Button } from "../../ui/button";
import { SettingsSection } from "./settings-section";

const meta = {
  title: "Templates/SettingsSection",
  component: SettingsSection,
  tags: ["autodocs"],
  args: {
    title: "Name",
    description: "Shown to the other people in the team.",
    children: <input aria-label="Name" className="w-full rounded-md border px-3 py-2" />,
    footer: <Button>Save</Button>,
  },
} satisfies Meta<typeof SettingsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AsForm: Story = {
  args: {
    as: "form",
    onSubmit: fn((event: { preventDefault: () => void }) => event.preventDefault()),
  },
};

export const WithActions: Story = { args: { actions: <a href="/help">Help</a> } };

export const BodyOnly: Story = {
  args: { title: undefined, description: undefined, footer: undefined },
};
