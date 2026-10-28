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
  return readdirSync(`src/${layer}`, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(`src/${layer}/${entry.name}/index.ts`))
    .map((entry) => entry.name)
    .sort();
}

function writeBarrel(layer) {
  const lines = folders(layer)
    .filter((name) => !standalone[layer].has(name))
    .map((name) => `export * from "./${name}";`);
  writeFileSync(`src/${layer}/index.ts`, `${lines.join("\n")}\n`);
  return lines.length;
}

const effects = writeBarrel("effects");
const ui = writeBarrel("ui");
const charts = writeBarrel("charts");
const forms = writeBarrel("forms");
const data = writeBarrel("data");

writeFileSync(
  "src/index.ts",
  [
    'export { cn } from "./lib/cn";',
    'export { useIsDark } from "./lib/use-is-dark";',
    'export * from "./ui";',
    'export * from "./effects";',
    'export * from "./data";',
    'export * from "./i18n";',
    "",
  ].join("\n"),
);
console.log(
  `charts: ${charts}; forms: ${forms}; data: ${data}; effects: ${effects} in barrel, ${standalone.effects.size} standalone; ui: ${ui} in barrel, ${standalone.ui.size} standalone`,
);
