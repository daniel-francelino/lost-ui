import { renderToString } from "react-dom/server";
import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  LostI18nProvider,
  lostI18n,
  lostLanguages,
  lostMessages,
  registerMessages,
  translate,
  useLostTranslation,
} from ".";

function Probe({ name = "date.placeholder" }: { name?: string }) {
  const { t, language } = useLostTranslation();
  return (
    <p data-language={language}>{t(name as Parameters<typeof t>[0], { query: "x", count: 3 })}</p>
  );
}

afterEach(async () => {
  await lostI18n.changeLanguage("en");
});

function keysOf(messages: object, prefix = ""): string[] {
  return Object.entries(messages).flatMap(([key, value]) =>
    typeof value === "string" ? [`${prefix}${key}`] : keysOf(value as object, `${prefix}${key}.`),
  );
}

describe("messages", () => {
  it("has the same keys in every language", () => {
    const english = keysOf(lostMessages.en).sort();
    for (const language of lostLanguages) {
      expect(keysOf(lostMessages[language]).sort(), language).toEqual(english);
    }
  });

  it("keeps the same placeholders in every language", () => {
    const placeholders = (text: string) => (text.match(/{{\w+}}/g) ?? []).sort();
    for (const key of keysOf(lostMessages.en)) {
      const read = (language: (typeof lostLanguages)[number]) =>
        key
          .split(".")
          .reduce<unknown>((node, part) => (node as never)[part], lostMessages[language]);
      for (const language of lostLanguages) {
        expect(placeholders(read(language) as string), `${language}:${key}`).toEqual(
          placeholders(read("en") as string),
        );
      }
    }
  });

  it("has no empty text", () => {
    for (const language of lostLanguages) {
      expect(keysOf(lostMessages[language]).length).toBeGreaterThan(0);
      for (const key of keysOf(lostMessages[language])) {
        const text = key
          .split(".")
          .reduce<unknown>((node, part) => (node as never)[part], lostMessages[language]);
        expect((text as string).trim(), `${language}:${key}`).not.toBe("");
      }
    }
  });
});

describe("LostI18nProvider", () => {
  it("shows English until a language is set", () => {
    render(<Probe />);
    expect(screen.getByText("Pick a date")).toBeInTheDocument();
  });

  it.each([
    ["es", "Elegir una fecha"],
    ["pt", "Escolher uma data"],
    ["en", "Pick a date"],
  ])("shows the texts in %s", (language, text) => {
    render(
      <LostI18nProvider language={language}>
        <Probe />
      </LostI18nProvider>,
    );
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("uses the language of a regional code", () => {
    render(
      <LostI18nProvider language="pt-BR">
        <Probe />
      </LostI18nProvider>,
    );
    expect(screen.getByText("Escolher uma data")).toBeInTheDocument();
  });

  it("falls back to English for a language it does not have", () => {
    render(
      <LostI18nProvider language="fr">
        <Probe />
      </LostI18nProvider>,
    );
    expect(screen.getByText("Pick a date")).toBeInTheDocument();
  });

  it("renders again when the language changes", async () => {
    render(<Probe />);
    expect(screen.getByText("Pick a date")).toBeInTheDocument();

    await act(async () => {
      await lostI18n.changeLanguage("es");
    });

    expect(screen.getByText("Elegir una fecha")).toBeInTheDocument();
  });

  it("changes the language when the prop changes", () => {
    const { rerender } = render(
      <LostI18nProvider language="es">
        <Probe />
      </LostI18nProvider>,
    );
    expect(screen.getByText("Elegir una fecha")).toBeInTheDocument();

    rerender(
      <LostI18nProvider language="pt">
        <Probe />
      </LostI18nProvider>,
    );
    expect(screen.getByText("Escolher uma data")).toBeInTheDocument();
  });

  it("renders the language on the server, so the browser hydrates the same text", () => {
    const html = renderToString(
      <LostI18nProvider language="pt-BR">
        <Probe />
      </LostI18nProvider>,
    );
    expect(html).toContain("Escolher uma data");
  });

  it("fills the placeholders of a text", () => {
    render(
      <LostI18nProvider language="pt">
        <Probe name="inputMenu.create" />
      </LostI18nProvider>,
    );
    expect(screen.getByText("Criar “x”")).toBeInTheDocument();
  });
});

describe("translate", () => {
  it("translates outside React with the current language", async () => {
    expect(translate("rules.required")).toBe("This field is required");

    await lostI18n.changeLanguage("pt");

    expect(translate("rules.required")).toBe("Este campo é obrigatório");
    expect(translate("rules.minLength", { limit: 3 })).toBe("Use pelo menos 3 caracteres");
  });
});

describe("registerMessages", () => {
  it("adds the texts of an app and follows the same language", async () => {
    registerMessages("app", {
      en: { welcome: "Welcome, {{name}}" },
      pt: { welcome: "Bem-vindo, {{name}}" },
    });

    function Welcome() {
      const { t } = useLostTranslation("app");
      return <p>{t("welcome", { name: "Ada" })}</p>;
    }

    const { rerender } = render(<Welcome />);
    expect(screen.getByText("Welcome, Ada")).toBeInTheDocument();

    rerender(
      <LostI18nProvider language="pt">
        <Welcome />
      </LostI18nProvider>,
    );
    expect(screen.getByText("Bem-vindo, Ada")).toBeInTheDocument();
  });
});
