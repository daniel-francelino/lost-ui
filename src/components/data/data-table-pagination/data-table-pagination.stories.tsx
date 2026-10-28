import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { DataTablePagination } from "./data-table-pagination";

const meta = {
  title: "Data/DataTablePagination",
  component: DataTablePagination,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { page: 2, pageSize: 10, total: 45, onPageChange: fn() },
} satisfies Meta<typeof DataTablePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FirstPage: Story = { args: { page: 1 } };

export const LastPage: Story = { args: { page: 5 } };

export const Empty: Story = { args: { page: 1, total: 0 } };

export const Disabled: Story = { args: { disabled: true } };

export const WithPageSize: Story = {
  args: { pageSizeOptions: [10, 25, 50], onPageSizeChange: fn() },
  render: (args) => {
    const [page, setPage] = useState(args.page);
    const [pageSize, setPageSize] = useState(args.pageSize);

    return (
      <DataTablePagination
        {...args}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    );
  },
};
