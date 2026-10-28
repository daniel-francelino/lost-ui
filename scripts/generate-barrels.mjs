import { existsSync, readdirSync, writeFileSync } from "node:fs";

const standalone = {
  effects: new Set([
    "globe",
    "confetti",
    "dotted-map",
    "highlighter",
    "tweet-card",
    "client-tweet-card",
    "code-comparison",
    "icon-cloud",
  ]),
  charts: new Set(),
  data: new Set(),
  forms: new Set([
    "form-input-date",
    "form-pin-input",
    "form-input-phone",
    "form-country-select",
    "form-emoji-picker",
    "form-builder",
  ]),
  elements: new Set(),
  app: new Set(["app"]),
  ui: new Set([
    "calendar",
    "carousel",
    "command",
    "drawer",
    "form",
    "input-otp",
    "resizable",
    "sonner",
  ]),
};

function folders(layer) {
  return readdirSync(`src/components/${layer}`, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() && existsSync(`src/components/${layer}/${entry.name}/index.ts`),
    )
    .map((entry) => entry.name)
    .sort();
}

function writeBarrel(layer) {
  const lines = folders(layer)
    .filter((name) => !standalone[layer].has(name))
    .map((name) => `export * from "./${name}";`);
  writeFileSync(`src/components/${layer}/index.ts`, `${lines.join("\n")}\n`);
  return lines.length;
}

const effects = writeBarrel("effects");
const ui = writeBarrel("ui");
const elements = writeBarrel("elements");
const app = writeBarrel("app");
const charts = writeBarrel("charts");
const forms = writeBarrel("forms");
const data = writeBarrel("data");

writeFileSync(
  "src/index.ts",
  [
    'export { cn } from "./lib/cn";',
    'export { useIsDark } from "./lib/use-is-dark";',
    'export * from "./components/ui";',
    'export * from "./components/elements";',
    'export * from "./components/effects";',
    'export * from "./components/data";',
    'export * from "./i18n";',
    "",
  ].join("\n"),
);
console.log(
  `app: ${app}; elements: ${elements}; charts: ${charts}; forms: ${forms}; data: ${data}; effects: ${effects} in barrel, ${standalone.effects.size} standalone; ui: ${ui} in barrel, ${standalone.ui.size} standalone`,
);
