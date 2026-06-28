import { beforeEach, describe, expect, it, vi } from "vitest";
import setRequest from "../src/request";
import type { IO } from "../src/types";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function okResponse(data: unknown) {
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => Promise.resolve(data),
  });
}

function errorResponse(status: number, data: unknown = {}) {
  return Promise.resolve({
    ok: false,
    status,
    statusText: "Error",
    json: () => Promise.resolve(data),
  });
}

describe("setRequest", () => {
  beforeEach(() => mockFetch.mockReset());

  // ────────────────────────────────────────────────────────────
  // URL construction
  // ────────────────────────────────────────────────────────────

  describe("URL construction", () => {
    it("appends path to baseUrl", async () => {
      mockFetch.mockReturnValueOnce(okResponse({}));
      const fn = setRequest("https://api.example.com", () => null);
      await fn({ method: "get", path: "/users" } as IO, {}, null, {});
      expect(mockFetch.mock.calls[0][0]).toContain("https://api.example.com/users");
    });

    it("falls back to localhost when baseUrl is empty", async () => {
      mockFetch.mockReturnValueOnce(okResponse({}));
      const fn = setRequest("", () => null);
      await fn({ method: "get", path: "/test" } as IO, {}, null, {});
      expect(mockFetch.mock.calls[0][0]).toContain("http://localhost:3000/test");
    });

    it("replaces path params in URL", async () => {
      mockFetch.mockReturnValueOnce(okResponse({ id: "123" }));
      const fn = setRequest("https://api.example.com", () => null);
      await fn({ method: "get", path: "/users/{userId}" } as IO, { userId: "123" }, null, {});
      expect(mockFetch.mock.calls[0][0]).toContain("/users/123");
    });

    it("throws when a path param is not resolved", async () => {
      const fn = setRequest("https://api.example.com", () => null);
      await expect(
        fn({ method: "get", path: "/users/{userId}" } as IO, {}, null, {}),
      ).rejects.toThrow();
    });

    it("GET appends payload keys as query string", async () => {
      mockFetch.mockReturnValueOnce(okResponse([]));
      const fn = setRequest("https://api.example.com", () => null);
      const route: IO = { method: "get", path: "/users", payload: ["page", "limit"] };
      await fn(route, {}, { page: "2", limit: "10" }, {});
      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain("page=2");
      expect(url).toContain("limit=10");
    });

    it("route-level baseUrl overrides global baseUrl", async () => {
      mockFetch.mockReturnValueOnce(okResponse({}));
      const fn = setRequest("https://api.example.com", () => null);
      const route: IO = { method: "get", path: "/items", baseUrl: "https://other.example.com" };
      await fn(route, {}, null, {});
      expect(mockFetch.mock.calls[0][0]).toContain("https://other.example.com/items");
    });
  });

  // ────────────────────────────────────────────────────────────
  // Body serialization
  // ────────────────────────────────────────────────────────────

  describe("body serialization", () => {
    it("POST sends JSON with Content-Type application/json", async () => {
      mockFetch.mockReturnValueOnce(okResponse({ success: true }));
      const fn = setRequest("https://api.example.com", () => null);
      const route: IO = { method: "post", path: "/users", payload: ["name", "email"] };
      await fn(route, {}, { name: "John", email: "john@example.com" }, {});
      const [, init] = mockFetch.mock.calls[0];
      expect(init.headers["Content-Type"]).toBe("application/json");
      expect(JSON.parse(init.body as string)).toEqual({ name: "John", email: "john@example.com" });
    });

    it("filters out keys not listed in payload", async () => {
      mockFetch.mockReturnValueOnce(okResponse({}));
      const fn = setRequest("https://api.example.com", () => null);
      const route: IO = { method: "post", path: "/users", payload: ["name"] };
      await fn(route, {}, { name: "John", secret: "ignored" }, {});
      const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
      expect(body).toEqual({ name: "John" });
      expect(body.secret).toBeUndefined();
    });

    it("auto-converts to FormData when payload contains a Blob", async () => {
      mockFetch.mockReturnValueOnce(okResponse({ url: "https://cdn.example.com/img.png" }));
      const fn = setRequest("https://api.example.com", () => null);
      const blob = new Blob(["content"], { type: "image/png" });
      const route: IO = { method: "post", path: "/upload", payload: ["userId", "file"] };
      await fn(route, {}, { userId: "123", file: blob }, {});
      const [, init] = mockFetch.mock.calls[0];
      expect(init.body).toBeInstanceOf(FormData);
      expect(init.headers["Content-Type"]).toBeUndefined();
    });

    it("auto-converts to FormData when payload contains a React Native file object", async () => {
      mockFetch.mockReturnValueOnce(okResponse({ url: "https://cdn.example.com/img.png" }));
      const fn = setRequest("https://api.example.com", () => null);
      const rnFile = { uri: "file:///var/mobile/photo.jpg", name: "photo.jpg", type: "image/jpeg" };
      const route: IO = { method: "post", path: "/upload", payload: ["userId", "file"] };
      await fn(route, {}, { userId: "123", file: rnFile }, {});
      const [, init] = mockFetch.mock.calls[0];
      expect(init.body).toBeInstanceOf(FormData);
      expect(init.headers["Content-Type"]).toBeUndefined();
    });

    it("auto-converts to FormData when payload contains a Node.js Buffer", async () => {
      mockFetch.mockReturnValueOnce(okResponse({ url: "https://cdn.example.com/file.pdf" }));
      const fn = setRequest("https://api.example.com", () => null);
      const buffer = Buffer.from("file content");
      const route: IO = { method: "post", path: "/upload", payload: ["userId", "file"] };
      await fn(route, {}, { userId: "123", file: buffer }, {});
      const [, init] = mockFetch.mock.calls[0];
      expect(init.body).toBeInstanceOf(FormData);
      expect(init.headers["Content-Type"]).toBeUndefined();
    });

    it("passes FormData directly when data is a FormData instance", async () => {
      mockFetch.mockReturnValueOnce(okResponse({}));
      const fn = setRequest("https://api.example.com", () => null);
      const formData = new FormData();
      formData.append("field", "value");
      const route: IO = { method: "post", path: "/upload", payload: [] };
      await fn(route, {}, formData as unknown as Record<string, unknown>, {});
      expect(mockFetch.mock.calls[0][1].body).toBe(formData);
    });

    it("user-specified Content-Type takes priority over auto-detection", async () => {
      mockFetch.mockReturnValueOnce(okResponse({}));
      const fn = setRequest("https://api.example.com", () => null);
      const route: IO = { method: "post", path: "/test", payload: ["data"] };
      await fn(route, {}, { data: "value" }, { "Content-Type": "text/plain" });
      expect(mockFetch.mock.calls[0][1].headers["Content-Type"]).toBe("text/plain");
    });

    it("user-specified Content-Type is preserved even when payload has Blob", async () => {
      mockFetch.mockReturnValueOnce(okResponse({}));
      const fn = setRequest("https://api.example.com", () => null);
      const blob = new Blob(["content"]);
      const route: IO = { method: "post", path: "/upload", payload: ["file"] };
      await fn(route, {}, { file: blob }, { "Content-Type": "application/octet-stream" });
      expect(mockFetch.mock.calls[0][1].headers["Content-Type"]).toBe("application/octet-stream");
    });

    it("uses first arg as body data when path has no params and data is omitted", async () => {
      mockFetch.mockReturnValueOnce(okResponse({}));
      const fn = setRequest("https://api.example.com", () => null);
      const route: IO = { method: "post", path: "/auth/login", payload: ["email", "password"] };
      // pathParams = { email, password }, data = null → requestData = pathParams
      await fn(route, { email: "a@b.com", password: "1234" }, null, {});
      const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
      expect(body).toEqual({ email: "a@b.com", password: "1234" });
    });
  });

  // ────────────────────────────────────────────────────────────
  // Authorization
  // ────────────────────────────────────────────────────────────

  describe("authorization", () => {
    it("adds Bearer token from getAuthorizeToken", async () => {
      mockFetch.mockReturnValueOnce(okResponse({}));
      const fn = setRequest("https://api.example.com", () => "my-token");
      await fn({ method: "get", path: "/protected" } as IO, {}, null, {});
      expect(mockFetch.mock.calls[0][1].headers.Authorization).toBe("Bearer my-token");
    });

    it("skips token when authorization is 'guest'", async () => {
      mockFetch.mockReturnValueOnce(okResponse({}));
      const fn = setRequest("https://api.example.com", () => "my-token");
      const route: IO = { method: "get", path: "/public", authorization: "guest" };
      await fn(route, {}, null, {});
      expect(mockFetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
    });

    it("does not fail when getAuthorizeToken returns null", async () => {
      mockFetch.mockReturnValueOnce(okResponse({}));
      const fn = setRequest("https://api.example.com", () => null);
      await expect(
        fn({ method: "get", path: "/users" } as IO, {}, null, {}),
      ).resolves.toBeDefined();
    });
  });

  // ────────────────────────────────────────────────────────────
  // Error handling
  // ────────────────────────────────────────────────────────────

  describe("error handling", () => {
    it("throws OolioError shape on non-ok response", async () => {
      mockFetch.mockReturnValueOnce(errorResponse(401, { message: "Unauthorized" }));
      const fn = setRequest("https://api.example.com", () => null);
      await expect(fn({ method: "get", path: "/users" } as IO, {}, null, {})).rejects.toMatchObject(
        {
          status: 401,
          statusText: "Error",
          data: { message: "Unauthorized" },
        },
      );
    });
  });

  // ────────────────────────────────────────────────────────────
  // Interceptors
  // ────────────────────────────────────────────────────────────

  describe("interceptors", () => {
    it("request interceptor can add headers before fetch", async () => {
      mockFetch.mockReturnValueOnce(okResponse({}));
      const fn = setRequest("https://api.example.com", () => null, undefined, {
        request: (config) => {
          config.headers["X-Custom"] = "test";
          return config;
        },
      });
      await fn({ method: "get", path: "/users" } as IO, {}, null, {});
      expect(mockFetch.mock.calls[0][1].headers["X-Custom"]).toBe("test");
    });

    it("response interceptor can transform the result", async () => {
      mockFetch.mockReturnValueOnce(okResponse({ result: { id: 1 } }));
      const fn = setRequest("https://api.example.com", () => null, undefined, {
        response: (data) => data.result,
      });
      const result = await fn({ method: "get", path: "/users" } as IO, {}, null, {});
      expect(result).toEqual({ id: 1 });
    });

    it("responseError interceptor can return a fallback value instead of throwing", async () => {
      mockFetch.mockReturnValueOnce(errorResponse(404));
      const fn = setRequest("https://api.example.com", () => null, undefined, {
        responseError: (err) => {
          if (err.status === 404) return null;
          throw err;
        },
      });
      const result = await fn({ method: "get", path: "/users/999" } as IO, {}, null, {});
      expect(result).toBeNull();
    });

    it("retry interceptor retries on failure and returns eventual success", async () => {
      mockFetch
        .mockReturnValueOnce(errorResponse(503))
        .mockReturnValueOnce(okResponse({ ok: true }));
      const fn = setRequest("https://api.example.com", () => null, undefined, {
        retry: (err, _config, attempt) => err.status === 503 && attempt < 2,
      });
      const result = await fn({ method: "get", path: "/users" } as IO, {}, null, {});
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ ok: true });
    });

    it("retry gives up after limit and falls through to responseError", async () => {
      mockFetch.mockReturnValue(errorResponse(503));
      const fn = setRequest("https://api.example.com", () => null, undefined, {
        retry: (_err, _config, attempt) => attempt <= 2,
        responseError: () => "fallback",
      });
      const result = await fn({ method: "get", path: "/users" } as IO, {}, null, {});
      expect(mockFetch).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
      expect(result).toBe("fallback");
    });

    it("rethrows when no responseError interceptor is registered", async () => {
      mockFetch.mockReturnValueOnce(errorResponse(500));
      const fn = setRequest("https://api.example.com", () => null);
      await expect(fn({ method: "get", path: "/users" } as IO, {}, null, {})).rejects.toMatchObject(
        {
          status: 500,
        },
      );
    });
  });

  // ────────────────────────────────────────────────────────────
  // loggerPretty
  // ────────────────────────────────────────────────────────────

  describe("loggerPretty", () => {
    it("logger: true — 응답 객체를 raw object로 console.log에 전달", async () => {
      const spy = vi.spyOn(console, "log").mockImplementation(() => {});
      mockFetch.mockReturnValueOnce(okResponse({ data: { items: [{ id: 1 }], total: 1 } }));
      const fn = setRequest("https://api.example.com", () => null, { logger: true });
      await fn({ method: "get", path: "/users" } as IO, {}, null, {});
      const responseCall = spy.mock.calls.find((args) => String(args[0]).includes("←"));
      const resultArg = responseCall?.[responseCall.length - 1];
      expect(typeof resultArg).toBe("object");
      spy.mockRestore();
    });

    it("loggerPretty: true — 응답 객체를 JSON 문자열로 console.log에 전달", async () => {
      const spy = vi.spyOn(console, "log").mockImplementation(() => {});
      mockFetch.mockReturnValueOnce(okResponse({ data: { items: [{ id: 1 }], total: 1 } }));
      const fn = setRequest("https://api.example.com", () => null, {
        logger: true,
        loggerPretty: true,
      });
      await fn({ method: "get", path: "/users" } as IO, {}, null, {});
      const responseCall = spy.mock.calls.find((args) => String(args[0]).includes("←"));
      const resultArg = responseCall?.[responseCall.length - 1];
      expect(typeof resultArg).toBe("string");
      expect(resultArg).toContain('"items"');
      expect(resultArg).toContain('"total": 1');
      spy.mockRestore();
    });

    it("loggerPretty: true — 요청 객체도 JSON 문자열로 출력", async () => {
      const spy = vi.spyOn(console, "log").mockImplementation(() => {});
      mockFetch.mockReturnValueOnce(okResponse({}));
      const fn = setRequest("https://api.example.com", () => null, {
        logger: true,
        loggerPretty: true,
      });
      await fn(
        { method: "post", path: "/users" } as IO,
        {},
        { name: "test", nested: { a: 1 } },
        {},
      );
      const requestCall = spy.mock.calls.find(
        (args) => String(args[0]).includes("→") && args.length > 2,
      );
      const payloadArg = requestCall?.find((a) => typeof a === "string" && a.includes('"name"'));
      expect(payloadArg).toBeDefined();
      expect(payloadArg).toContain('"nested"');
      spy.mockRestore();
    });
  });
});
