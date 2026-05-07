export type PathParams = Record<string, string>;

export type Data = Record<string, any>;

export type Headers = Record<string, string>;

export interface PayloadDefinition {
  defaultValue?: any;
}

export type RequestPayload = Record<string, any>;
export type ResponseData = any;

/**
 * API 엔드포인트 정의.
 *
 * @example
 * { method: "get", path: "/user/{userId}" } as IO<{ userId: string }, User>
 * { method: "post", path: "/auth/login", payload: ["email", "password"] } as IO<LoginInput, { token: string }>
 */
export interface IO<
  _RequestPayload = RequestPayload,
  _ResponseData = ResponseData,
> {
  /** HTTP 메소드 (get | post | put | delete | patch) */
  method: string;
  /** 경로. path param은 {paramName} 형식으로 선언 */
  path: string;
  /** body(POST 등) 또는 query string(GET)에 포함할 키 목록. 미명시 키는 자동 제외 */
  payload?: string[];
  /** 라우트별 baseUrl 오버라이드 */
  baseUrl?: string;
  /** "guest" 설정 시 Bearer 토큰 미첨부 */
  authorization?: string | boolean;
}

export type Routes = {
  [category: string]: {
    [fnName: string]: IO<RequestPayload, ResponseData>;
  };
};

export type ApiClient<TRoutes extends Routes> = {
  [K in keyof TRoutes]: {
    [F in keyof TRoutes[K]]: TRoutes[K][F] extends IO<infer P, infer R>
      ? (data?: P) => Promise<R>
      : never;
  };
};

export interface OolioOption {
  /** true 설정 시 요청·응답·에러를 console에 출력. 운영 환경에서는 비활성화 권장 */
  logger?: boolean;
  /** true 설정 시 객체를 JSON.stringify로 전체 depth 출력. logger: true일 때만 적용 */
  loggerPretty?: boolean;
}

/**
 * 호출별 per-request 옵션. 마지막 인자로 전달한다.
 *
 * 마지막 인자가 `{ headers: <object> }` 키를 가지면 자동으로 options로 인식하므로
 * data를 생략하고 headers만 넘길 때 null을 채울 필요가 없다.
 *
 * @example
 * api.user.getProfile({ headers: { "X-Custom": "val" } })        // data 생략
 * api.auth.login({ email }, { headers: { "X-Trace": "id" } })    // data + headers
 * api.user.update({ id }, { name }, { headers: { "X-Trace": "id" } }) // 전부
 */
export interface RequestOptions {
  headers?: Headers;
}

export interface RequestConfig {
  url: string;
  method: string;
  headers: Headers;
  body?: BodyInit;
  route: IO;
}

export interface OolioError {
  status: number;
  statusText: string;
  data: any;
}

export interface OolioInterceptors {
  request?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  response?: (data: any, config: RequestConfig) => any | Promise<any>;
  responseError?: (
    error: OolioError,
    config: RequestConfig,
  ) => any | Promise<any>;
  retry?: (
    error: OolioError,
    config: RequestConfig,
    attempt: number,
  ) => boolean | Promise<boolean>;
}

export interface OolioConfig<TRoutes extends Routes = Routes> {
  routes: TRoutes;
  getAuthorizeToken: () => string | null;
  baseUrl: string;
  option?: OolioOption;
  interceptors?: OolioInterceptors;
}
