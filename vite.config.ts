import { defineConfig } from "vite";
import { createSageConfig } from "@wearesage/vue/vite";
import { config } from "dotenv";
import * as path from "node:path";

config();

// Pure magic - one function call!
export default defineConfig(async () => {
  const baseConfig = await createSageConfig({
    router: true
  });

  // Fix dayjs ES module issue from AppKit - merge configs properly
  return {
    ...baseConfig,
    optimizeDeps: {
      ...(baseConfig.optimizeDeps || {}),
      include: [
        ...(baseConfig.optimizeDeps?.include || []),
        "dayjs",
        "dayjs/locale/en",
        "dayjs/esm/locale/en"
      ],
      exclude: [
        ...(baseConfig.optimizeDeps?.exclude || []),
        "three",
        "three-stdlib",
        "@wearesage/vue"
      ]
    },
    resolve: {
      ...baseConfig.resolve,
      alias: {
        ...baseConfig.resolve?.alias,
        debug: path.resolve(__dirname, "src/lib/debug.js"),
        "content-type": path.resolve(__dirname, "src/lib/content-type.js"),
        "media-typer": path.resolve(__dirname, "src/lib/media-typer.js"),
        three: path.resolve(__dirname, "node_modules/three"),
        "three-stdlib": path.resolve(__dirname, "node_modules/three-stdlib")
      }
    }
  };
});
