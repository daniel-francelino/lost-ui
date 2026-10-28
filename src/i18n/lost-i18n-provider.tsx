import { useLayoutEffect, type ReactNode } from "react";

import { lostI18n } from "./i18n";

export type LostI18nProviderProps = {
  /** `"en"`, `"es"` or `"pt"`; a regional code such as `"pt-BR"` uses the language's texts. */
  language?: string;
  children?: ReactNode;
};

/** Sets the language of the texts the components bring. Put it once, near the root. */
export function LostI18nProvider({ language, children }: LostI18nProviderProps) {
  useLayoutEffect(() => {
    if (language && lostI18n.language !== language) void lostI18n.changeLanguage(language);
  }, [language]);

  return <>{children}</>;
}
