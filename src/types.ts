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
export interface IO<_RequestPayload = RequestPayload, _ResponseData = ResponseData> {
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
    [fnName: string]: IO<any, any>;
  };
};

export type ApiClient<TRoutes extends Routes> = {
  [K in keyof TRoutes]: {
    [F in keyof TRoutes[K]]: TRoutes[K][F] extends IO<infer P, infer R>
      ? {
          (data?: P, options?: RequestOptions): Promise<R>;
          (pathParams: PathParams, data?: P, options?: RequestOptions): Promise<R>;
        }
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
  /**
   * 이 호출에만 적용할 fetch init 옵션. 클라이언트 레벨 `fetchOptions`와 병합되며
   * (per-request 우선), oolio가 관리하는 `method`/`body`/`headers`가 항상 최종 우선한다.
   */
  fetchOptions?: RequestInit;
}

export interface RequestConfig {
  url: string;
  method: string;
  headers: Headers;
  body?: BodyInit;
  /**
   * fetch에 전달될 추가 init 옵션 (credentials, mode, cache, signal 등).
   * 인터셉터에서 변형 가능. `method`/`headers`/`body`는 oolio가 관리하므로
   * 여기에 지정해도 doFetch에서 위 필드가 우선한다.
   */
  fetchOptions?: RequestInit;
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
  responseError?: (error: OolioError, config: RequestConfig) => any | Promise<any>;
  retry?: (error: OolioError, config: RequestConfig, attempt: number) => boolean | Promise<boolean>;
}

export interface OolioConfig<TRoutes extends Routes = Routes> {
  routes: TRoutes;
  getAuthorizeToken: () => string | null;
  baseUrl: string;
  option?: OolioOption;
  interceptors?: OolioInterceptors;
  /**
   * 모든 요청의 fetch 호출에 적용할 기본 init 옵션 (credentials, mode, cache 등).
   * cross-origin 쿠키 인증이 필요하면 `{ credentials: "include" }`를 지정한다.
   * 호출별 `options.fetchOptions`로 덮어쓸 수 있다.
   */
  fetchOptions?: RequestInit;
}
