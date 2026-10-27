import { readdirSync, writeFileSync } from "node:fs";

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
    .filter((entry) => entry.isDirectory())
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

writeFileSync(
  "src/index.ts",
  [
    'export { cn } from "./lib/cn";',
    'export { useIsDark } from "./lib/use-is-dark";',
    'export * from "./ui";',
    'export * from "./effects";',
    "",
  ].join("\n"),
);
console.log(
  `effects: ${effects} in barrel, ${standalone.effects.size} standalone; ui: ${ui} in barrel, ${standalone.ui.size} standalone`,
);
