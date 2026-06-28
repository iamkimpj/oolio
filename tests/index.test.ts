import { beforeEach, describe, expect, it, vi } from "vitest";
import oolio from "../src/index";
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

describe("oolio", () => {
  beforeEach(() => mockFetch.mockReset());

  it("creates callable functions from routes", async () => {
    mockFetch.mockReturnValueOnce(okResponse({ token: "abc" }));
    const api = oolio({
      routes: {
        auth: {
          login: {
            method: "post",
            path: "/auth/login",
            payload: ["email", "password"],
          } as IO,
        },
      },
      getAuthorizeToken: () => null,
      baseUrl: "https://api.example.com",
    });
    expect(api.auth.login).toBeTypeOf("function");
    const result = await api.auth.login({ email: "a@b.com", password: "1234" });
    expect(result).toEqual({ token: "abc" });
  });

  it("passes first arg as body when route has no path params", async () => {
    mockFetch.mockReturnValueOnce(okResponse({ success: true }));
    const api = oolio({
      routes: {
        auth: {
          login: {
            method: "post",
            path: "/auth/login",
            payload: ["email", "password"],
          } as IO,
        },
      },
      getAuthorizeToken: () => null,
      baseUrl: "https://api.example.com",
    });
    await api.auth.login({ email: "a@b.com", password: "1234" });
    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body).toEqual({ email: "a@b.com", password: "1234" });
  });

  it("substitutes path params from first arg and uses second arg as body", async () => {
    mockFetch.mockReturnValueOnce(okResponse({ success: true }));
    const api = oolio({
      routes: {
        user: {
          update: {
            method: "put",
            path: "/user/{userId}",
            payload: ["name"],
          } as IO,
        },
      },
      getAuthorizeToken: () => null,
      baseUrl: "https://api.example.com",
    });
    await (api.user.update as (...args: unknown[]) => Promise<unknown>)(
      { userId: "123" },
      { name: "John" },
    );
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain("/user/123");
    expect(JSON.parse(init.body as string)).toEqual({ name: "John" });
  });

  it("no-param route: passes options.headers when data is omitted", async () => {
    mockFetch.mockReturnValueOnce(okResponse({}));
    const api = oolio({
      routes: { user: { me: { method: "get", path: "/me" } as IO } },
      getAuthorizeToken: () => null,
      baseUrl: "https://api.example.com",
    });
    await api.user.me({ headers: { "X-Custom": "test" } } as any);
    expect(mockFetch.mock.calls[0][1].headers["X-Custom"]).toBe("test");
  });

  it("no-param route: passes data and options.headers together", async () => {
    mockFetch.mockReturnValueOnce(okResponse({}));
    const api = oolio({
      routes: {
        auth: { login: { method: "post", path: "/auth/login", payload: ["email"] } as IO },
      },
      getAuthorizeToken: () => null,
      baseUrl: "https://api.example.com",
    });
    await (api.auth.login as (...args: unknown[]) => Promise<unknown>)(
      { email: "a@b.com" },
      { headers: { "X-Custom": "test" } },
    );
    const [, init] = mockFetch.mock.calls[0];
    expect(JSON.parse(init.body as string)).toEqual({ email: "a@b.com" });
    expect(init.headers["X-Custom"]).toBe("test");
  });

  it("path-param route: passes options.headers when data is omitted", async () => {
    mockFetch.mockReturnValueOnce(okResponse({}));
    const api = oolio({
      routes: { user: { get: { method: "get", path: "/user/{id}" } as IO } },
      getAuthorizeToken: () => null,
      baseUrl: "https://api.example.com",
    });
    await (api.user.get as (...args: unknown[]) => Promise<unknown>)(
      { id: "1" },
      { headers: { "X-Custom": "test" } },
    );
    expect(mockFetch.mock.calls[0][0]).toContain("/user/1");
    expect(mockFetch.mock.calls[0][1].headers["X-Custom"]).toBe("test");
  });

  it("path-param route: passes pathParams, data, and options.headers", async () => {
    mockFetch.mockReturnValueOnce(okResponse({}));
    const api = oolio({
      routes: {
        user: { update: { method: "put", path: "/user/{id}", payload: ["name"] } as IO },
      },
      getAuthorizeToken: () => null,
      baseUrl: "https://api.example.com",
    });
    await (api.user.update as (...args: unknown[]) => Promise<unknown>)(
      { id: "1" },
      { name: "John" },
      { headers: { "X-Custom": "test" } },
    );
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain("/user/1");
    expect(JSON.parse(init.body as string)).toEqual({ name: "John" });
    expect(init.headers["X-Custom"]).toBe("test");
  });

  it("forwards client-level fetchOptions to fetch (e.g. credentials)", async () => {
    mockFetch.mockReturnValueOnce(okResponse({}));
    const api = oolio({
      routes: { user: { me: { method: "get", path: "/me" } as IO } },
      getAuthorizeToken: () => null,
      baseUrl: "https://api.example.com",
      fetchOptions: { credentials: "include" },
    });
    await api.user.me();
    expect(mockFetch.mock.calls[0][1].credentials).toBe("include");
  });

  it("forwards client-level fetchOptions on non-get requests too", async () => {
    mockFetch.mockReturnValueOnce(okResponse({}));
    const api = oolio({
      routes: {
        user: { update: { method: "put", path: "/user/{id}", payload: ["name"] } as IO },
      },
      getAuthorizeToken: () => null,
      baseUrl: "https://api.example.com",
      fetchOptions: { credentials: "include" },
    });
    await (api.user.update as (...args: unknown[]) => Promise<unknown>)(
      { id: "1" },
      { name: "John" },
    );
    const [, init] = mockFetch.mock.calls[0];
    expect(init.credentials).toBe("include");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body as string)).toEqual({ name: "John" });
  });

  it("per-request fetchOptions overrides client-level fetchOptions", async () => {
    mockFetch.mockReturnValueOnce(okResponse({}));
    const api = oolio({
      routes: { user: { me: { method: "get", path: "/me" } as IO } },
      getAuthorizeToken: () => null,
      baseUrl: "https://api.example.com",
      fetchOptions: { credentials: "include", cache: "no-store" },
    });
    await api.user.me({ fetchOptions: { credentials: "same-origin" } } as any);
    const [, init] = mockFetch.mock.calls[0];
    expect(init.credentials).toBe("same-origin");
    expect(init.cache).toBe("no-store");
  });

  it("oolio-managed headers win over fetchOptions.headers", async () => {
    mockFetch.mockReturnValueOnce(okResponse({}));
    const api = oolio({
      routes: { auth: { login: { method: "post", path: "/login", payload: ["email"] } as IO } },
      getAuthorizeToken: () => null,
      baseUrl: "https://api.example.com",
      fetchOptions: { headers: { "Content-Type": "text/plain", "X-Base": "1" } },
    });
    await api.auth.login({ email: "a@b.com" });
    const [, init] = mockFetch.mock.calls[0];
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.headers["X-Base"]).toBe("1");
  });

  it("makes fetchOptions visible to interceptors via config", async () => {
    mockFetch.mockReturnValueOnce(okResponse({}));
    let seen: RequestInit | undefined;
    const api = oolio({
      routes: { user: { me: { method: "get", path: "/me" } as IO } },
      getAuthorizeToken: () => null,
      baseUrl: "https://api.example.com",
      fetchOptions: { credentials: "include" },
      interceptors: {
        request: (config) => {
          seen = config.fetchOptions;
          return config;
        },
      },
    });
    await api.user.me();
    expect(seen?.credentials).toBe("include");
  });

  it("passes interceptors through to every request", async () => {
    mockFetch.mockReturnValueOnce(okResponse({ result: { id: 1 } }));
    const api = oolio({
      routes: {
        user: {
          get: { method: "get", path: "/user" } as IO,
        },
      },
      getAuthorizeToken: () => null,
      baseUrl: "https://api.example.com",
      interceptors: {
        response: (data) => data.result,
      },
    });
    const result = await api.user.get();
    expect(result).toEqual({ id: 1 });
  });
});
