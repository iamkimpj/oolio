interface PathParams {
    [key: string]: string;
}
interface Data {
    [key: string]: any;
}
interface Headers {
    [key: string]: string;
}
interface RouteConfig {
    method: string;
    path: string;
    payload?: string[];
    baseUrl?: string;
    authorization?: string | boolean;
    files?: string[];
}
export default function createOolio(_baseUrl: string, getAuthorizeToken: () => string | null): (this: RouteConfig, pathParams?: PathParams, data?: Data | null, headers?: Headers) => Promise<any>;
export {};
//# sourceMappingURL=request.d.ts.map