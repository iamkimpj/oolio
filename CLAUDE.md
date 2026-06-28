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

- **`src/request.ts`** — 실제 HTTP 로직. `setRequest(baseUrl, getAuthorizeToken, option?, interceptors?, fetchOptions?)`가 클로저를 반환한다. 내부 흐름: `buildRequestConfig`로 url/headers/body 직렬화 → request 인터셉터 → `doFetch` → response/retry/responseError 인터셉터. GET은 query string, binary(File/Blob) payload는 자동 multipart, 그 외는 JSON.

**호출 시그니처 규칙**:
- path에 `{param}` 패턴이 있으면: `fn(pathParams?, data?, options?)`
- path에 `{param}` 패턴이 없으면: `fn(data?, options?)`
- 마지막 인자가 `headers` 또는 `fetchOptions` 키를 가지면 자동으로 per-request options로 인식. data를 생략하고 options만 넘길 때 null을 채울 필요 없다.
- args 라우팅은 `index.ts`의 `hasParams()` 분기에서 처리. `request.ts`의 `requestFn`은 항상 `(route, pathParams, data, headers, fetchOptions?)` 고정 시그니처로 받는다.

**`fetchOptions` (fetch init 주입)**: `oolio({ fetchOptions })`로 모든 요청에, 호출별 `options.fetchOptions`로 개별 요청에 fetch init 옵션(`credentials`, `mode`, `cache`, `signal` 등)을 주입한다. 둘은 per-request 우선으로 병합되어 `RequestConfig.fetchOptions`에 담기고 `doFetch`에서 `fetch`에 spread된다. 단 oolio가 관리하는 `method`/`body`/`headers`는 항상 최종 우선(`fetchOptions.headers`보다 직렬화 헤더가 우선). 쿠키 인증(특히 cross-origin)은 `credentials: "include"` 필요.

**`ApiClient` 타입**: path params 유무를 런타임에서만 판별하므로, TypeScript 타입은 두 시그니처를 오버로드로 선언한다. `(data?, options?)` 와 `(pathParams, data?, options?)` 모두 허용한다. 이 덕분에 path params 있는 route에 인자 2개를 넘겨도 TS 에러가 발생하지 않는다.

**빌드 출력**: `build.js`가 esbuild로 `dist/index.mjs`(ESM), `dist/index.cjs`(CJS), `dist/index.d.ts`(타입 선언)를 생성한다. 타입 선언은 tsc가 아니라 `build.js` 내에서 하드코딩된 문자열로 덮어쓴다.

**llms.txt**: AI 코드 어시스턴트용 참조 문서. 호출 시그니처 규칙, options 감지 로직, 자주 하는 실수 등이 정리되어 있다. 라이브러리 동작이 바뀌면 함께 업데이트해야 한다.
