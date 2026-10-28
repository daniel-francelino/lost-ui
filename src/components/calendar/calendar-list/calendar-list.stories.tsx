import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { calendars } from "../calendar.fixtures";
import { CalendarList } from "./calendar-list";

const meta = {
  title: "Calendar/CalendarList",
  component: CalendarList,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { calendars, onToggle: fn() },
  decorators: [
    (Story) => (
      <div className="w-56">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CalendarList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SomeHidden: Story = {
  args: { calendars: calendars.map((calendar, index) => ({ ...calendar, visible: index === 0 })) },
};

export const WithCreate: Story = { args: { onCreate: fn() } };

export const WithoutTitle: Story = { args: { showTitle: false } };

export const Empty: Story = { args: { calendars: [] } };
