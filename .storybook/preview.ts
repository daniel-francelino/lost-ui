import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import { createElement } from "react";

import { LostI18nProvider } from "../src/i18n";
import "./preview.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: { disable: true },
    a11y: { test: "todo" },
  },
  globalTypes: {
    locale: {
      description: "Language of the texts the components bring",
      toolbar: {
        title: "Language",
        icon: "globe",
        dynamicTitle: true,
        items: [
          { value: "en", title: "English" },
          { value: "es", title: "Español" },
          { value: "pt", title: "Português" },
        ],
      },
    },
  },
  initialGlobals: { locale: "en" },
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
    (Story, context) =>
      createElement(
        LostI18nProvider,
        { language: String(context.globals["locale"] ?? "en") },
        createElement(Story),
      ),
  ],
};

export default preview;
