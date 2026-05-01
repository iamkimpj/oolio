import setRequest from "./request";
import type { OolioConfig, Routes, ApiClient } from "./types";

export type { Route } from "./types";
import { warnNoRoutes, warnNoGetAuthorizeToken } from "./warnings";

export default function oolio<TRoutes extends Routes>({
  routes,
  getAuthorizeToken,
  baseUrl,
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
        api[category][fnName] = (...args: any[]) => {
          const requestFn = setRequest(baseUrl, getAuthorizeToken);
          return requestFn(routes[category][fnName], ...args);
        };
      }
    }
  })();

  return api as ApiClient<TRoutes>;
}
