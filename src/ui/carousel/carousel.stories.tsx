import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./carousel";

const meta = {
  title: "UI/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: "w-56" },
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent>
        {[1, 2, 3].map((slide) => (
          <CarouselItem key={slide}>
            <div className="flex aspect-square items-center justify-center rounded-md border text-3xl font-semibold">
              {slide}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};
