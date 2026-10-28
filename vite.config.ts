import { existsSync, readdirSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = import.meta.dirname;
const sourceFile = /\.tsx?$/;

function componentEntries(layer: string): Record<string, string> {
  const layerDir = resolve(root, "src", layer);
  return Object.fromEntries(
    readdirSync(layerDir, { withFileTypes: true })
      .filter(
        (entry) => entry.isDirectory() && existsSync(resolve(layerDir, entry.name, "index.ts")),
      )
      .map((entry) => [`${layer}/${entry.name}/index`, resolve(layerDir, entry.name, "index.ts")]),
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
        "effects/index": resolve(root, "src/effects/index.ts"),
        "ui/index": resolve(root, "src/ui/index.ts"),
        "charts/index": resolve(root, "src/charts/index.ts"),
        ...componentEntries("effects"),
        ...componentEntries("ui"),
        ...componentEntries("charts"),
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
