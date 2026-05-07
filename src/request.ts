import type {
  PathParams,
  Data,
  Headers,
  PayloadDefinition,
  IO,
  OolioOption,
  OolioInterceptors,
  RequestConfig,
  OolioError,
} from "./types";

const genRequestId = (): string => Math.random().toString(36).slice(2, 8);

const maskAuthorization = (headers: Headers): Headers => {
  if (!headers.Authorization) return headers;
  const v = headers.Authorization;
  let masked: string;
  if (v.length > 16) {
    masked = `${v.slice(0, 8)}...${v.slice(-8)}`;
  } else if (v.length > 8) {
    masked = `${v.slice(0, 4)}...${v.slice(-4)}`;
  } else {
    masked = v;
  }
  return { ...headers, Authorization: masked };
};

export const hasParams = (path: string): boolean => {
  const paramPattern = /\/\{[^}]+\}/g;
  return paramPattern.test(path);
};

const isBinary = (v: unknown): boolean =>
  (typeof File !== "undefined" && v instanceof File) ||
  (typeof Blob !== "undefined" && v instanceof Blob);

const containsBinary = (data: Data): boolean => {
  for (const key in data) {
    if (isBinary(data[key])) return true;
  }
  return false;
};

const convQueryParamsForGet = (
  payload: string[] | { [key: string]: PayloadDefinition } = [],
  data: Data = {},
): Data => {
  const query: Data = {};
  if (Array.isArray(payload)) {
    for (const key in data) {
      if (payload.indexOf(key) !== -1) {
        query[key] =
          data[key] === undefined || data[key] === null
            ? ""
            : typeof data[key] === "object"
              ? JSON.stringify(data[key])
              : data[key];
      }
    }
  } else {
    for (const key in payload) {
      if (data[key] !== undefined) {
        query[key] =
          data[key] == null
            ? ""
            : typeof data[key] === "object"
              ? JSON.stringify(data[key])
              : data[key];
      } else {
        const definition = payload[key];
        if (definition) {
          query[key] = definition.defaultValue;
        }
      }
    }
  }
  return query;
};

const filterPayloadForJson = (
  payload: string[] | { [key: string]: PayloadDefinition } = [],
  data: Data = {},
): Data => {
  const result: Data = {};
  if (Array.isArray(payload)) {
    for (const key in data) {
      if (payload.indexOf(key) !== -1) {
        result[key] = data[key];
      }
    }
  } else {
    for (const key in payload) {
      if (data[key] !== undefined) {
        result[key] = data[key];
      } else {
        const definition = payload[key];
        if (definition) {
          result[key] = definition.defaultValue;
        }
      }
    }
  }
  return result;
};

const setPath = (path: string, pathParams: PathParams = {}): string => {
  if (!path) {
    console.log("path is undefined");
    return path;
  }

  if (!hasParams(path)) {
    return path;
  }

  let modifiedPath = path;
  for (const [key, value] of Object.entries(pathParams)) {
    const paramPattern = new RegExp(`\\{${key}\\}`, "g");
    modifiedPath = modifiedPath.replace(paramPattern, value);
  }

  const unresolved = modifiedPath.match(/\{[^}]+\}/g);
  if (unresolved) {
    throw new Error(
      `[oolio] 경로 파라미터가 치환되지 않았습니다: ${unresolved.join(", ")} (path: ${path})`,
    );
  }

  return modifiedPath;
};

const buildRequestConfig = async (
  route: IO,
  pathParams: PathParams,
  data: Data | null,
  headers: Headers,
  _baseUrl: string,
  getAuthorizeToken: () => string | null,
): Promise<RequestConfig> => {
  const {
    method,
    path,
    payload = [],
    baseUrl = null,
    authorization = null,
  } = route;

  let url = baseUrl ? baseUrl : _baseUrl ? _baseUrl : "http://localhost:3000";
  let requestData: Data = data || {};

  if (hasParams(path)) {
    url = url + setPath(path, pathParams);
  } else {
    url = url + path;
    if (!data) requestData = pathParams;
  }

  if (authorization !== "guest" && getAuthorizeToken) {
    const token = await getAuthorizeToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let body: BodyInit | undefined;

  if (method === "get") {
    const query = convQueryParamsForGet(payload, requestData);
    url = `${url}?${new URLSearchParams(query).toString()}`;
  } else {
    const userSpecifiedContentType = headers["Content-Type"] !== undefined;

    if (requestData instanceof FormData) {
      body = requestData;
      if (!userSpecifiedContentType) delete headers["Content-Type"];
    } else {
      const filtered = filterPayloadForJson(payload, requestData);
      if (containsBinary(filtered)) {
        const formData = new FormData();
        for (const key in filtered) {
          const v = filtered[key];
          if (isBinary(v)) {
            formData.append(key, v as Blob);
          } else if (v === null || v === undefined) {
            formData.append(key, "");
          } else if (typeof v === "object") {
            formData.append(key, JSON.stringify(v));
          } else {
            formData.append(key, String(v));
          }
        }
        body = formData;
        if (!userSpecifiedContentType) delete headers["Content-Type"];
      } else {
        body = JSON.stringify(filtered);
        if (!userSpecifiedContentType) {
          headers["Content-Type"] = "application/json";
        }
      }
    }
  }

  return { url, method, headers, body, route };
};

const doFetch = async (config: RequestConfig): Promise<any> => {
  const { url, method, headers, body } = config;
  const init: RequestInit =
    method === "get" ? { headers } : { method, headers, body };
  const response = await fetch(url, init);
  if (!response.ok) {
    // TODO: 서버가 JSON이 아닌 응답(HTML, plain text 등)을 반환할 경우 json() 파싱 에러 발생
    const error = await response.json();
    throw {
      status: response.status,
      statusText: response.statusText,
      data: error,
    };
  }
  return response.json();
};

export default (
  _baseUrl: string,
  getAuthorizeToken: () => string | null,
  option?: OolioOption,
  interceptors?: OolioInterceptors,
) => {
  return async (
    route: IO,
    pathParams: PathParams = {},
    data: Data | null = null,
    headers: Headers = {},
  ): Promise<any> => {
    const log = option?.logger === true;
    const pretty = log && option?.loggerPretty === true;
    const fmt = (...args: unknown[]) =>
      pretty
        ? args.map((a) =>
            typeof a === "object" && a !== null ? JSON.stringify(a, null, 2) : a,
          )
        : args;
    const reqId = log ? genRequestId() : "";
    const tag = `[oolio]:${reqId}`;
    const startedAt = log ? Date.now() : 0;

    let config = await buildRequestConfig(
      route,
      pathParams,
      data,
      headers,
      _baseUrl,
      getAuthorizeToken,
    );

    if (interceptors?.request) {
      config = await interceptors.request(config);
    }

    if (log) {
      console.log(...fmt(`${tag} →`, route, {
        pathParams,
        data,
        headers: maskAuthorization(config.headers),
      }));
      console.log(`${tag} →`, config.method.toUpperCase(), config.url);
    }

    let attempt = 0;
    while (true) {
      try {
        let result = await doFetch(config);
        if (interceptors?.response) {
          result = await interceptors.response(result, config);
        }
        if (log) {
          console.log(
            ...fmt(
              `${tag} ←`,
              config.method.toUpperCase(),
              config.url,
              `(${Date.now() - startedAt}ms)`,
              result,
            ),
          );
        }
        return result;
      } catch (err) {
        attempt++;
        if (interceptors?.retry) {
          const shouldRetry = await interceptors.retry(
            err as OolioError,
            config,
            attempt,
          );
          if (shouldRetry) {
            if (log) {
              console.log(
                `${tag} ↻`,
                config.method.toUpperCase(),
                config.url,
                `attempt ${attempt + 1}`,
              );
            }
            continue;
          }
        }
        if (interceptors?.responseError) {
          const handled = await interceptors.responseError(
            err as OolioError,
            config,
          );
          if (log) {
            console.log(
              ...fmt(
                `${tag} ← (handled by responseError)`,
                config.method.toUpperCase(),
                config.url,
                `(${Date.now() - startedAt}ms)`,
                handled,
              ),
            );
          }
          return handled;
        }
        if (log) {
          console.error(
            ...fmt(
              `${tag} ✗`,
              config.method.toUpperCase(),
              config.url,
              `(${Date.now() - startedAt}ms)`,
              err,
            ),
          );
        }
        throw err;
      }
    }
  };
};
