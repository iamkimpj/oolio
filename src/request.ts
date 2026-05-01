import type {
  PathParams,
  Data,
  Headers,
  PayloadDefinition,
  Route,
} from "./types";

const hasParams = (path: string): boolean => {
  const paramPattern = /\/\{[^}]+\}/g;
  return paramPattern.test(path);
};

const hasFiles = (fileIndex?: string[]): boolean => {
  if (!fileIndex) return false;
  return fileIndex.length > 0;
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

const getBodyFromDataWithFile = (
  payload: string[] = [],
  fileIndex: string[] = [],
  data: Data = {},
): FormData => {
  const formData = new FormData();
  const filteredData = convQueryParamsForGet(payload, data);

  // payload에 포함된 필드 처리
  for (const key in filteredData) {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(filteredData[key]);
    formData.append(encodedKey, encodedValue);
  }

  // files에 포함된 필드 처리
  for (const key in data) {
    if (fileIndex.includes(key)) {
      formData.append(key, data[key]);
    }
  }

  return formData;
};

const getBodyFromData = (payload: string[] = [], data: Data = {}): FormData => {
  const filteredData = convQueryParamsForGet(payload, data);
  const formData = new FormData();

  for (const key in filteredData) {
    formData.append(key, filteredData[key]);
  }
  return formData;
};

const setPath = (path: string, pathParams: PathParams = {}): string => {
  if (!path) {
    console.log("path is undefined");
    return path;
  }

  // 경로 파라미터가 있는지 확인
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

const runGetApi = async (
  url: string,
  payload: string[],
  queryParams: Data = {},
  headers: Headers = {},
): Promise<any> => {
  const query = convQueryParamsForGet(payload, queryParams);

  const response = await fetch(
    `${url}?${new URLSearchParams(query).toString()}`,
    {
      headers,
    },
  );

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

const runApi = async (
  url: string,
  method: string,
  payload: string[],
  data: Data = {},
  headers: Headers = {},
): Promise<any> => {
  const body = getBodyFromData(payload, data);
  const response = await fetch(url, {
    method,
    headers,
    body,
  });

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

const runApiWithFiles = async (
  url: string,
  method: string,
  payload: string[],
  fileIndex: string[] = [],
  data: Data = {},
  headers: Headers = {},
): Promise<any> => {
  const body = getBodyFromDataWithFile(payload, fileIndex, data);
  delete headers["Content-Type"];

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

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

export default (_baseUrl: string, getAuthorizeToken: () => string | null) => {
  return async (
    route: Route,
    pathParams: PathParams = {},
    data: Data | null = null,
    headers: Headers = {},
  ): Promise<any> => {
    const {
      method,
      path,
      payload = [],
      baseUrl = null,
      authorization = null,
      files = undefined,
    } = route;

    let url = baseUrl ? baseUrl : _baseUrl ? _baseUrl : "http://localhost:3000";
    let requestData = data || {};

    if (hasParams(path)) {
      url = url + setPath(path, pathParams);
    } else {
      url = url + path;
      if (!data) {
        requestData = pathParams;
      }
    }

    if (authorization !== "guest" && getAuthorizeToken) {
      const token = await getAuthorizeToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    if (method === "get") {
      return runGetApi(url, payload, requestData, headers);
    } else if (hasFiles(files)) {
      return runApiWithFiles(url, method, payload, files, requestData, headers);
    } else {
      return runApi(url, method, payload, requestData, headers);
    }
  };
};
