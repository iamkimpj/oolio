interface PathParams {
    [key: string]: string;
}
interface Data {
    [key: string]: any;
}
interface Headers {
    [key: string]: string;
}
export interface tpRoute {
    method: string;
    path: string;
    payload?: string[];
    baseUrl?: string;
    authorization?: string | boolean;
    files?: string[];
}
declare const _default: (_baseUrl: string, getAuthorizeToken: () => string | null) => (route: tpRoute, pathParams?: PathParams, data?: Data | null, headers?: Headers) => Promise<any>;
export default _default;
//# sourceMappingURL=request.d.ts.map