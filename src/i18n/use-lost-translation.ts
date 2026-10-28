import { useTranslation } from "react-i18next";

import { LOST_NAMESPACE, lostI18n, type LostKey } from "./i18n";

type Options = Record<string, unknown>;

type LostTranslation<K extends string> = {
  t: (key: K, options?: Options) => string;
  language: string;
  i18n: typeof lostI18n;
};

/**
 * The translation function of the library, bound to its own instance. It renders again when
 * the language changes. With a namespace it reads the texts the app added with `registerMessages`.
 */
export function useLostTranslation(): LostTranslation<LostKey>;
export function useLostTranslation(namespace: string): LostTranslation<string>;
export function useLostTranslation(namespace: string = LOST_NAMESPACE): LostTranslation<string> {
  // the hook makes the component render again on a language change; the text comes from the instance
  const { i18n } = useTranslation(namespace, { i18n: lostI18n, useSuspense: false });

  return {
    t: (key, options) => lostI18n.t(key, { ns: namespace, ...options }) as string,
    language: i18n.resolvedLanguage ?? i18n.language,
    i18n: lostI18n,
  };
}
