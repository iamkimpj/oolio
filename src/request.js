const hasParams = (path) => {
  const paramPattern = /\/\{[^}]+\}/g;
  return paramPattern.test(path);
};
const hasFiles = (fileIndex = undefined) => {
  if (fileIndex == undefined) return false;
  return fileIndex.length > 0;
};

const convQueryParamsForGet = (payload = [], data = {}) => {
  const query = {};
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

const getBodyFromDataWithFile = (payload = [], fileIndex = [], data = {}) => {
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

const getBodyFromData = (payload = [], data = {}) => {
  const filteredData = convQueryParamsForGet(payload, data);
  const formData = new FormData();

  for (const key in filteredData) {
    formData.append(key, filteredData[key]);
  }
  return formData;
};

const setPath = (path, pathParams = {}) => {
  if (!path) {
    console.log("path is undefined");
    return path;
  }

  // 경로 파라미터가 있는지 확인
  if (!hasParams(path)) {
    return path;
  }

  // 각 경로 파라미터를 실제 값으로 치환
  let modifiedPath = path;
  for (const [key, value] of Object.entries(pathParams)) {
    const paramPattern = new RegExp(`\\{${key}\\}`, "g");
    modifiedPath = modifiedPath.replace(paramPattern, value);
  }

  return modifiedPath;
};

const runGetApi = (url, payload, queryParams = {}, headers = {}) => {
  const query = convQueryParamsForGet({ payload }, queryParams);

  return fetch(`${url}?${new URLSearchParams(query).toString()}`, {
    headers,
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((err) => {
        throw {
          status: res.status,
          statusText: res.statusText,
          data: err,
        };
      });
    }
    return res.json();
  });
};

const runApi = (url, method, payload, data = {}, headers = {}) => {
  const body = getBodyFromData({ payload }, data);
  return fetch(url, {
    method,
    headers,
    body,
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((err) => {
        throw {
          status: res.status,
          statusText: res.statusText,
          data: err,
        };
      });
    }
    return res.json();
  });
};

const runApiWithFiles = (
  url,
  method,
  payload,
  fileIndex = [],
  data = {},
  headers = {}
) => {
  const body = getBodyFromDataWithFile(payload, fileIndex, data);

  if (headers["Content-Type"] == undefined) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  return fetch(url, {
    method,
    headers,
    body,
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((err) => {
        throw {
          status: res.status,
          statusText: res.statusText,
          data: err,
        };
      });
    }
    return res.json();
  });
};

export const api = {};
export default function createOolio(_baseUrl, getAuthorizeToken) {
  return async function request(pathParams = {}, data = null, headers = {}) {
    const {
      method,
      path,
      payload = [],
      baseUrl = null,
      authorization = null,
      files = undefined,
    } = this;

    let url = baseUrl ? baseUrl : _baseUrl ? _baseUrl : "http://localhost:3000";
    let requestData = data;

    if (hasParams(path)) {
      url = url + setPath(path, pathParams);
    } else {
      url = url + path;
      if (!data) {
        requestData = pathParams;
      }
    }

    if (authorization != "guest" && getAuthorizeToken) {
      const token = await getAuthorizeToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    if (method == "get") {
      return runGetApi(url, payload, requestData, headers);
    } else if (hasFiles(files)) {
      return runApiWithFiles(url, method, payload, files, requestData, headers);
    } else {
      return runApi(url, method, payload, requestData, headers);
    }
  };
}
