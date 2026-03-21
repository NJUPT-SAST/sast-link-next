const getToken = jest.fn();

jest.mock("@/lib/token", () => ({
  getToken: () => getToken(),
}));

import { oAuth } from "./oauth";

describe("lib/api/oauth", () => {
  beforeEach(() => {
    getToken.mockReset();
    jest.restoreAllMocks();
  });

  it("builds an authorize url with non-empty params only", () => {
    getToken.mockReturnValue(null);
    const appendSpy = jest.spyOn(URLSearchParams.prototype, "append");
    jest.spyOn(console, "error").mockImplementation(() => {});

    oAuth({
      client_id: "client-id",
      code_challenge: "challenge",
      code_challenge_method: "S256",
      redirect_uri: "http://localhost/callback",
      response_type: "code",
      scope: "profile",
      state: null,
    });

    expect(appendSpy.mock.calls).toEqual([
      ["client_id", "client-id"],
      ["code_challenge", "challenge"],
      ["code_challenge_method", "S256"],
      ["redirect_uri", "http://localhost/callback"],
      ["response_type", "code"],
      ["scope", "profile"],
    ]);
  });

  it("appends the current token as part when available", () => {
    getToken.mockReturnValue("token-123");
    const appendSpy = jest.spyOn(URLSearchParams.prototype, "append");
    jest.spyOn(console, "error").mockImplementation(() => {});

    oAuth({
      client_id: "client-id",
      code_challenge: null,
      code_challenge_method: null,
      redirect_uri: null,
      response_type: "code",
      scope: null,
      state: "abc",
    });

    expect(appendSpy.mock.calls).toEqual([
      ["client_id", "client-id"],
      ["response_type", "code"],
      ["state", "abc"],
      ["part", "token-123"],
    ]);
  });
});
