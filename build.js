import { execSync } from "child_process";
import { promises as fs } from "fs";
import * as esbuild from "esbuild";

async function build() {
  try {
    console.log("🧹 Cleaning dist directory...");
    await fs.rm("dist", { recursive: true, force: true });

    console.log("📝 Generating TypeScript declarations...");
    execSync("npx tsc --emitDeclarationOnly", { stdio: "inherit" });

    const commonOptions = {
      entryPoints: ["src/index.ts"],
      bundle: true,
      sourcemap: true,
      platform: "neutral",
      target: ["es2020"],
      minify: true,
      define: {
        "process.env.NODE_ENV": '"production"',
      },
    };

    console.log("📦 Building ESM bundle...");
    await esbuild.build({
      ...commonOptions,
      outfile: "dist/index.mjs",
      format: "esm",
    });

    console.log("📦 Building CommonJS bundle...");
    await esbuild.build({
      ...commonOptions,
      outfile: "dist/index.cjs",
      format: "cjs",
    });

    console.log("✅ Build completed successfully!");
    console.log("📁 Generated files:");
    console.log("   - dist/index.mjs (ESM bundle)");
    console.log("   - dist/index.cjs (CommonJS bundle)");
    console.log("   - dist/index.d.ts (TypeScript declarations)");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  } finally {
    await esbuild.stop();
  }
}

build();
