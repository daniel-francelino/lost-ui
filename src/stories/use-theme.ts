import { useCallback } from "react";

import { useIsDark } from "../lib/use-is-dark";

export function useTheme() {
  const isDark = useIsDark();
  const theme = isDark ? "dark" : "light";

  const setTheme = useCallback((next: string) => {
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  return { theme, resolvedTheme: theme, systemTheme: "light", setTheme };
}
