import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
// import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	plugins: [
		devtools(),
		tsconfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
		tanstackStart({}),
		nitro(),
		viteReact(),
		// visualizer({
		// 	open: true,
		// 	gzipSize: true,
		// 	brotliSize: true,
		// 	filename: "bundle-analysis.html",
		// }),
	],
});

export default config;
