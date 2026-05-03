import type { OolioConfig, Routes, ApiClient } from "./types";
export type { IO } from "./types";
export default function oolio<TRoutes extends Routes>({ routes, getAuthorizeToken, baseUrl, }: OolioConfig<TRoutes>): ApiClient<TRoutes>;
//# sourceMappingURL=index.d.ts.map