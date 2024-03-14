import { build } from "esbuild";
import { copy } from "esbuild-plugin-copy";

await build({
  bundle: true,
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  platform: "node",
  target: "node20",
  sourcemap: true,
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["node_modules/@fastify/swagger-ui/static/*"],
        to: ["dist/static"],
      },
    }),
  ],
});
