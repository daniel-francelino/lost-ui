import { Tooltip } from "recharts";
import { describe, expect, it } from "vitest";

import { ChartTooltip } from "./chart-tooltip";

describe("ChartTooltip", () => {
  it("is the Recharts tooltip", () => {
    expect(ChartTooltip).toBe(Tooltip);
  });
});
