# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build        # clean + tsc (타입 선언) + esbuild (ESM/CJS 번들)
npm run dev          # build without clean
npm run clean        # dist 디렉토리 삭제
npm test             # vitest run (단위 테스트)
npm run test:watch   # vitest watch 모드
npm run lint         # biome lint
npm run format       # biome format --write
npm run check        # biome check --write (lint + format 통합)
```

테스트는 `tests/` 디렉토리에 있다. 수동 시나리오 테스트는 `example.js` 참고.

## Architecture

소스는 `src/` 아래 두 파일뿐이다:

- **`src/index.ts`** — 진입점. `oolio(config)` 함수가 routes 트리를 순회하며 `api[category][fnName]` 형태의 호출 가능한 객체를 만들어 반환한다. 각 함수는 호출 시마다 `setRequest`로 requestFn을 생성해 실행한다.

- **`src/request.ts`** — 실제 HTTP 로직. `setRequest(baseUrl, getAuthorizeToken, option?, interceptors?)`가 클로저를 반환한다. 내부 흐름: `buildRequestConfig`로 url/headers/body 직렬화 → request 인터셉터 → `doFetch` → response/retry/responseError 인터셉터. GET은 query string, binary(File/Blob) payload는 자동 multipart, 그 외는 JSON.

**호출 시그니처 규칙**: path에 `{param}` 패턴이 있으면 첫 번째 인자가 path params, 두 번째가 body data. 없으면 첫 번째 인자가 data로 직접 사용된다.

**빌드 출력**: `build.js`가 esbuild로 `dist/index.mjs`(ESM), `dist/index.cjs`(CJS), `dist/index.d.ts`(타입 선언)를 생성한다. 타입 선언은 tsc가 아니라 `build.js` 내에서 하드코딩된 문자열로 덮어쓴다.
