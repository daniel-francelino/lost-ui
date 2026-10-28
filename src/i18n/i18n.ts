import i18next, { type i18n } from "i18next";

import { en, type Messages } from "./locales/en";
import { es } from "./locales/es";
import { pt } from "./locales/pt";

/** The namespace of the texts the components bring. Apps keep their own in other namespaces. */
export const LOST_NAMESPACE = "lost-ui";

export const lostLanguages = ["en", "es", "pt"] as const;
export type LostLanguage = (typeof lostLanguages)[number];

export const lostMessages: Record<LostLanguage, Messages> = { en, es, pt };

type Paths<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : Paths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

/** Every text key of the components, e.g. `"date.placeholder"`. */
export type LostKey = Paths<Messages>;

/**
 * The i18next instance of the library. It is its own instance, so it does not touch the one
 * of the app; the app picks the language with `LostI18nProvider` and can add its own texts to
 * it with `registerMessages`.
 */
export const lostI18n: i18n = i18next.createInstance();

void lostI18n.init({
  lng: "en",
  fallbackLng: "en",
  supportedLngs: [...lostLanguages],
  // "pt-BR" and "es-MX" use the texts of "pt" and "es"
  nonExplicitSupportedLngs: true,
  ns: [LOST_NAMESPACE],
  defaultNS: LOST_NAMESPACE,
  resources: {
    en: { [LOST_NAMESPACE]: en },
    es: { [LOST_NAMESPACE]: es },
    pt: { [LOST_NAMESPACE]: pt },
  },
  interpolation: { escapeValue: false },
  // the texts are in the bundle, so the instance is ready as soon as it is created
  initAsync: false,
});

/** Translates outside React, e.g. in a validation rule. */
export function translate(key: LostKey, options?: Record<string, unknown>): string {
  return lostI18n.t(key, options) as string;
}

/**
 * Adds the texts of the app to the instance of the library, by language, so one language
 * switch changes both. `registerMessages("app", { en: {...}, pt: {...} })`.
 */
export function registerMessages(
  namespace: string,
  resources: Partial<Record<string, Record<string, unknown>>>,
): void {
  for (const [language, messages] of Object.entries(resources)) {
    if (messages) lostI18n.addResourceBundle(language, namespace, messages, true, true);
  }
}
