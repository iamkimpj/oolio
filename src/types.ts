export type PathParams = Record<string, string>;

export type Data = Record<string, any>;

export type Headers = Record<string, string>;

export interface PayloadDefinition {
  defaultValue?: any;
}

export type RequestPayload = Record<string, any>;
export type ResponseData = any;

export interface IO<
  _RequestPayload = RequestPayload,
  _ResponseData = ResponseData,
> {
  method: string;
  path: string;
  payload?: string[];
  baseUrl?: string;
  authorization?: string | boolean;
  files?: string[];
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

export interface OolioConfig<TRoutes extends Routes = Routes> {
  routes: TRoutes;
  getAuthorizeToken: () => string | null;
  baseUrl: string;
}
