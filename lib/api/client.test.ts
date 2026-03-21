describe("lib/api/client", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("creates the axios client with the configured base URL and registers an interceptor", async () => {
    const use = jest.fn();
    const create = jest.fn(() => ({
      interceptors: {
        request: {
          use,
        },
      },
    }));

    jest.doMock("axios", () => ({
      __esModule: true,
      default: { create },
    }));
    jest.doMock("@/lib/token", () => ({
      getToken: jest.fn(() => "token-123"),
    }));

    const { apiClient } = await import("./client");

    expect(create).toHaveBeenCalledWith({ baseURL: "" });
    expect(apiClient.interceptors.request.use).toBe(use);
    expect(use).toHaveBeenCalledTimes(1);

    const interceptor = use.mock.calls[0][0] as (config: {
      headers: Record<string, string>;
    }) => { headers: Record<string, string> };

    const config = interceptor({ headers: {} });
    expect(config.headers.Token).toBe("token-123");
  });

  it("leaves request headers untouched when no token is available", async () => {
    const use = jest.fn();
    const create = jest.fn(() => ({
      interceptors: {
        request: {
          use,
        },
      },
    }));

    jest.doMock("axios", () => ({
      __esModule: true,
      default: { create },
    }));
    jest.doMock("@/lib/token", () => ({
      getToken: jest.fn(() => null),
    }));

    await import("./client");

    const interceptor = use.mock.calls[0][0] as (config: {
      headers: Record<string, string>;
    }) => { headers: Record<string, string> };

    const config = { headers: {} };
    expect(interceptor(config)).toBe(config);
    expect(config.headers).toEqual({});
  });
});
