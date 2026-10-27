import { readdirSync, writeFileSync } from "node:fs";

const standalone = new Set([
  "globe",
  "confetti",
  "dotted-map",
  "highlighter",
  "tweet-card",
  "client-tweet-card",
  "code-comparison",
  "icon-cloud",
]);

const files = readdirSync("src/effects")
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(".tsx", ""))
  .sort();

const lines = files
  .filter((name) => !standalone.has(name))
  .map((name) => `export * from "./${name}";`);
writeFileSync("src/effects/index.ts", `${lines.join("\n")}\n`);

writeFileSync(
  "src/index.ts",
  [
    'export { cn } from "./lib/cn";',
    'export { useIsDark } from "./lib/use-is-dark";',
    'export * from "./ui/button";',
    'export * from "./ui/scroll-area";',
    'export * from "./effects";',
    "",
  ].join("\n"),
);
console.log(`${lines.length} in barrel, ${standalone.size} standalone`);
