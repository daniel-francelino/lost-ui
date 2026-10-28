import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { WeekView } from "./week-view";
import * as stories from "./week-view.stories";

const { Playground, MondayFirst, Compact } = composeStories(stories);

describe("WeekView", () => {
  it("shows the seven days of the week of the date", () => {
    render(<Playground />);
    expect(
      screen.getAllByRole("columnheader").map((h) => h.textContent?.replace(/\D/g, "")),
    ).toEqual(["25", "26", "27", "28", "29", "30", "31"]);
  });

  it("starts on Monday when told to", () => {
    render(<MondayFirst />);
    expect(
      screen.getAllByRole("columnheader").map((h) => h.textContent?.replace(/\D/g, "")),
    ).toEqual(["26", "27", "28", "29", "30", "31", "1"]);
  });

  it("shows the events of the week only", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: /Team standup/ })).toBeInTheDocument();
    render(<WeekView date={new Date(2026, 10, 10)} events={Playground.args.events!} />);
    expect(screen.getAllByRole("button", { name: /Team standup/ })).toHaveLength(1);
  });

  it("can be compact", () => {
    const { container } = render(<Compact />);
    expect(container.querySelector("[data-slot='time-grid-scroll'] > div")).toHaveStyle({
      height: "768px",
    });
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <WeekView date={new Date(2026, 9, 28)} events={[]} now={new Date(2026, 9, 28)} />
      </LostI18nProvider>,
    );
    expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent(/dom/i);
  });
});
