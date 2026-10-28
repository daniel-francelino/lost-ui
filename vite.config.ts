import { existsSync, readdirSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = import.meta.dirname;
const sourceFile = /\.tsx?$/;

function componentEntries(layer: string): Record<string, string> {
  const layerDir = resolve(root, "src/components", layer);
  return Object.fromEntries(
    readdirSync(layerDir, { withFileTypes: true })
      .filter(
        (entry) => entry.isDirectory() && existsSync(resolve(layerDir, entry.name, "index.ts")),
      )
      .map((entry) => [
        `components/${layer}/${entry.name}/index`,
        resolve(layerDir, entry.name, "index.ts"),
      ]),
  );
}

function libEntries(): Record<string, string> {
  const libDir = resolve(root, "src/lib");
  return Object.fromEntries(
    readdirSync(libDir)
      .filter((file) => sourceFile.test(file))
      .map((file) => [`lib/${file.replace(sourceFile, "")}`, resolve(libDir, file)]),
  );
}

const external = (id: string) =>
  !id.startsWith(".") && !id.startsWith("@/") && !id.startsWith("\0") && !isAbsolute(id);

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": resolve(root, "src") } },
  build: {
    lib: {
      entry: {
        index: resolve(root, "src/index.ts"),
        "i18n/index": resolve(root, "src/i18n/index.ts"),
        "components/effects/index": resolve(root, "src/components/effects/index.ts"),
        "components/ui/index": resolve(root, "src/components/ui/index.ts"),
        "components/elements/index": resolve(root, "src/components/elements/index.ts"),
        "components/app/index": resolve(root, "src/components/app/index.ts"),
        "components/charts/index": resolve(root, "src/components/charts/index.ts"),
        "components/forms/index": resolve(root, "src/components/forms/index.ts"),
        "components/templates/index": resolve(root, "src/components/templates/index.ts"),
        "components/data/index": resolve(root, "src/components/data/index.ts"),
        ...componentEntries("effects"),
        ...componentEntries("ui"),
        ...componentEntries("elements"),
        ...componentEntries("app"),
        ...componentEntries("charts"),
        ...componentEntries("forms"),
        ...componentEntries("data"),
        ...componentEntries("templates"),
        ...libEntries(),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external,
      output: { preserveModules: true, preserveModulesRoot: "src", entryFileNames: "[name].js" },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
