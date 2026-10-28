import { describe, expect, it } from "vitest";

import {
  buildSeriesConfig,
  CHART_COLORS,
  configLabel,
  paletteColor,
  seriesFromConfig,
} from "./index";

describe("chart series helpers", () => {
  it("builds a config with the palette colours by position", () => {
    const config = buildSeriesConfig([{ key: "desktop" }, { key: "mobile", label: "Mobile" }]);
    expect(config.desktop).toEqual({ label: "desktop", color: "var(--chart-1)" });
    expect(config.mobile).toEqual({ label: "Mobile", color: "var(--chart-2)" });
  });

  it("keeps an explicit colour", () => {
    const config = buildSeriesConfig([{ key: "desktop", color: "red" }]);
    expect(config.desktop?.color).toBe("red");
  });

  it("keeps the icon of a series", () => {
    const Icon = () => null;
    expect(buildSeriesConfig([{ key: "desktop", icon: Icon }]).desktop?.icon).toBe(Icon);
  });

  it("turns a shadcn config back into a series list", () => {
    const series = seriesFromConfig({
      desktop: { label: "Desktop", color: "var(--chart-1)" },
      mobile: { label: "Mobile" },
    });
    expect(series).toEqual([
      { key: "desktop", label: "Desktop", color: "var(--chart-1)" },
      { key: "mobile", label: "Mobile" },
    ]);
  });

  it("wraps the palette around after five colours", () => {
    expect(paletteColor(0)).toBe(CHART_COLORS[0]);
    expect(paletteColor(5)).toBe(CHART_COLORS[0]);
    expect(paletteColor(7)).toBe(CHART_COLORS[2]);
  });

  it("reads a label from the config and falls back to the key", () => {
    const config = { chrome: { label: "Google Chrome" } };
    expect(configLabel(config, "chrome")).toBe("Google Chrome");
    expect(configLabel(config, "edge")).toBe("edge");
  });
});
