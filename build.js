import { execSync } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import * as esbuild from "esbuild";

async function build() {
  try {
    // dist 디렉토리 정리
    console.log("🧹 Cleaning dist directory...");
    await fs.rm("dist", { recursive: true, force: true });
    await fs.mkdir("dist", { recursive: true });

    // TypeScript 컴파일 (타입 정의 생성)
    console.log("📝 Generating TypeScript declarations...");
    execSync("npx tsc --emitDeclarationOnly", { stdio: "inherit" });

    // ESM 빌드
    console.log("📦 Building ESM bundle...");
    await esbuild.build({
      entryPoints: ["src/index.ts"],
      outfile: "dist/index.mjs",
      format: "esm",
      bundle: true,
      sourcemap: true,
      platform: "node",
      target: "node14",
      minify: true,
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      external: [],
    });

    // CommonJS 빌드
    console.log("📦 Building CommonJS bundle...");
    await esbuild.build({
      entryPoints: ["src/index.ts"],
      outfile: "dist/index.cjs",
      format: "cjs",
      bundle: true,
      sourcemap: true,
      platform: "node",
      target: "node14",
      minify: true,
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      external: [],
    });

    // 타입 정의 파일 정리 및 메인 타입 정의 생성
    console.log("📋 Organizing type definitions...");
    
    // index.d.ts 파일을 올바른 내용으로 교체
    const indexTypeContent = `import request from "./request.js";

interface Route {
  method: string;
  path: string;
  payload?: string[];
  files?: string[];
  authorization?: boolean;
}

interface Routes {
  [category: string]: {
    [fnName: string]: Route;
  };
}

interface OolioConfig {
  routes: Routes;
  getAuthorizeToken: () => string | null;
  baseUrl: string;
}

declare function oolio(config: OolioConfig): Record<string, any>;

export default oolio;`;
    
    await fs.writeFile("dist/index.d.ts", indexTypeContent, "utf8");

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
