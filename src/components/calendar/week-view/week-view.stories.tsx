import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { calendars, events, now } from "../calendar.fixtures";
import { WeekView } from "./week-view";

const meta = {
  title: "Calendar/WeekView",
  component: WeekView,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    date: now,
    now,
    events,
    calendars,
    scrollToHour: 7,
    onEventClick: fn(),
    onDayClick: fn(),
    onCreate: fn(),
  },
  decorators: [
    (Story) => (
      <div className="flex h-[36rem] flex-col">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WeekView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const MondayFirst: Story = { args: { weekStartsOn: 1 } };

export const Zoomed: Story = { args: { hourHeight: 80 } };

export const Compact: Story = { args: { hourHeight: 32 } };
