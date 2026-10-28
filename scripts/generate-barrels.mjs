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
  templates: new Set(),
  app: new Set(["app"]),
  "ai-chat": new Set(),
  editor: new Set(),
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

// the layers of `src/components`; `templates` (pages and layouts) lives beside it in `src/templates`
const dir = (layer) => (layer === "templates" ? "src/templates" : `src/components/${layer}`);

function folders(layer) {
  return readdirSync(dir(layer), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(`${dir(layer)}/${entry.name}/index.ts`))
    .map((entry) => entry.name)
    .sort();
}

function writeBarrel(layer) {
  const lines = folders(layer)
    .filter((name) => !standalone[layer].has(name))
    .map((name) => `export * from "./${name}";`);
  writeFileSync(`${dir(layer)}/index.ts`, `${lines.join("\n")}\n`);
  return lines.length;
}

const effects = writeBarrel("effects");
const ui = writeBarrel("ui");
const elements = writeBarrel("elements");
const app = writeBarrel("app");
const aiChat = writeBarrel("ai-chat");
const editor = writeBarrel("editor");
// templates are grouped by category (`auth`, `errors`, `backoffice`, later `marketing`, `ecommerce`…):
// each category folder has its own barrel and the root barrel re-exports the categories
const templateCategories = readdirSync("src/templates", { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== "lib")
  .map((entry) => entry.name)
  .sort();
let templates = 0;
for (const category of templateCategories) {
  const pages = readdirSync(`src/templates/${category}`, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(`src/templates/${category}/${e.name}/index.ts`))
    .map((e) => e.name)
    .sort();
  writeFileSync(
    `src/templates/${category}/index.ts`,
    `${pages.map((name) => `export * from "./${name}";`).join("\n")}\n`,
  );
  templates += pages.length;
}
writeFileSync(
  "src/templates/index.ts",
  `${templateCategories.map((name) => `export * from "./${name}";`).join("\n")}\n`,
);
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
  `templates: ${templates}; app: ${app}; ai-chat: ${aiChat}; editor: ${editor}; elements: ${elements}; charts: ${charts}; forms: ${forms}; data: ${data}; effects: ${effects} in barrel, ${standalone.effects.size} standalone; ui: ${ui} in barrel, ${standalone.ui.size} standalone`,
);
