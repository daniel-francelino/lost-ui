import { Legend } from "recharts";
import { describe, expect, it } from "vitest";

import { ChartLegend } from "./chart-legend";

describe("ChartLegend", () => {
  it("is the Recharts legend", () => {
    expect(ChartLegend).toBe(Legend);
  });
});
