import setRequest, { hasParams } from "./request";
import type { ApiClient, OolioConfig, RequestOptions, Routes } from "./types";

export type { IO } from "./types";

import { warnNoGetAuthorizeToken, warnNoRoutes } from "./warnings";

/**
 * routes 트리로 typed API 클라이언트를 생성한다.
 *
 * 호출 시그니처는 route의 path에 `{param}` 패턴 유무로 결정된다.
 *
 * - path params 없음: `fn(data?, options?)`
 * - path params 있음: `fn(pathParams?, data?, options?)` 또는 `fn(pathParams?, options?)`
 *
 * `options`는 `{ headers?: Record<string, string> }` 형태. 마지막 인자가 `headers` 키를
 * 가지면 자동으로 options로 인식하므로 중간 인자를 null로 채울 필요가 없다.
 *
 * @example
 * const api = oolio({ routes, getAuthorizeToken: () => token, baseUrl: "https://api.example.com" });
 * await api.auth.login({ email: "a@b.com", password: "1234" });
 * await api.user.update({ userId: "1" }, { name: "John" });
 * await api.user.update({ userId: "1" }, { name: "John" }, { headers: { "X-Trace": "id" } });
 */
export default function oolio<TRoutes extends Routes>({
  routes,
  getAuthorizeToken,
  baseUrl,
  option,
  interceptors,
  fetchOptions,
}: OolioConfig<TRoutes>): ApiClient<TRoutes> {
  const api: Record<string, any> = {};

  (function init(): void {
    if (!routes) {
      warnNoRoutes();
      return;
    } else if (!getAuthorizeToken) {
      warnNoGetAuthorizeToken();
      return;
    }

    for (const category in routes) {
      if (!api[category]) {
        api[category] = {};
      }
      for (const fnName in routes[category]) {
        const route = routes[category][fnName];
        api[category][fnName] = (...args: any[]) => {
          const requestFn = setRequest(
            baseUrl,
            getAuthorizeToken,
            option,
            interceptors,
            fetchOptions,
          );

          let callOptions: RequestOptions = {};
          let positionalArgs = args;
          const lastArg = args[args.length - 1];
          if (
            lastArg !== null &&
            typeof lastArg === "object" &&
            ("headers" in lastArg || "fetchOptions" in lastArg)
          ) {
            callOptions = lastArg;
            positionalArgs = args.slice(0, -1);
          }

          const headers = callOptions.headers ?? {};
          const perRequestFetchOptions = callOptions.fetchOptions;

          if (hasParams(route.path)) {
            const [pathParams = {}, data = null] = positionalArgs;
            return requestFn(route, pathParams, data, headers, perRequestFetchOptions);
          } else {
            const [data = null] = positionalArgs;
            return requestFn(route, {}, data, headers, perRequestFetchOptions);
          }
        };
      }
    }
  })();

  return api as ApiClient<TRoutes>;
}
