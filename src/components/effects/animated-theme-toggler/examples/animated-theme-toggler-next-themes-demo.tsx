import { useTheme } from "../../../../stories/use-theme";

import { AnimatedThemeToggler } from "..";

export default function AnimatedThemeTogglerNextThemesDemo() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex justify-center p-6">
      <AnimatedThemeToggler
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onThemeChange={setTheme}
      />
    </div>
  );
}
