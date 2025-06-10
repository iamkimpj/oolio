import { execSync } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import * as esbuild from "esbuild";

async function build() {
  try {
    // dist 디렉토리 정리
    await fs.rm("dist", { recursive: true, force: true });
    await fs.mkdir("dist", { recursive: true });

    // TypeScript 컴파일
    console.log("Building...");
    execSync("npm run tsc", { stdio: "inherit" });

    // ESM 빌드
    await esbuild.build({
      entryPoints: ["src/index.js"],
      outfile: "dist/index.js",
      format: "esm",
      bundle: true,
      sourcemap: true,
      platform: "node",
      target: "node14",
      minify: true,
      define: {
        "process.env.NODE_ENV": '"production"',
      },
    });

    // CJS 빌드
    await esbuild.build({
      entryPoints: ["src/index.js"],
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
    });

    // CommonJS 모듈 래핑
    // console.log("Wrapping CommonJS module...");
    // const cjsPath = path.join("dist", "index.cjs");
    // let cjsContent = await fs.readFile(cjsPath, "utf8");
    // cjsContent = `module.exports = (() => {\n${cjsContent}\nreturn instance;\n})();`;
    // await fs.writeFile(cjsPath, cjsContent, "utf8");

    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  } finally {
    await esbuild.stop();
  }
}

build();
