import { useLayoutEffect, useState, type ReactNode } from "react";

import { lostI18n } from "./i18n";

export type LostI18nProviderProps = {
  /** `"en"`, `"es"` or `"pt"`; a regional code such as `"pt-BR"` uses the language's texts. */
  language?: string;
  children?: ReactNode;
};

function setLanguage(language: string | undefined) {
  if (language && lostI18n.language !== language) void lostI18n.changeLanguage(language);
}

/**
 * Sets the language of the texts the components bring. Put it once, near the root. The language
 * is set before the first render, so a page rendered on the server (SSR) and hydrated in the
 * browser has the same texts in both. The server keeps one language for the whole process.
 */
export function LostI18nProvider({ language, children }: LostI18nProviderProps) {
  useState(() => setLanguage(language));

  useLayoutEffect(() => {
    setLanguage(language);
  }, [language]);

  return <>{children}</>;
}
