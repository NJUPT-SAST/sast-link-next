jest.mock("./client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import { apiClient } from "./client";
import {
  getFeishuLoginStatus,
  getGithubLoginStatus,
  resetPassword,
  sendMail,
  userRegister,
  verifyCaptcha,
  verifyLoginAccount,
  verifyRegistAccount,
  verifyResetAccount,
} from "./auth";

describe("lib/api/auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls verify account endpoints with the correct flag", () => {
    verifyRegistAccount("foo");
    verifyLoginAccount("bar");
    verifyResetAccount("baz");

    expect(apiClient.get).toHaveBeenNthCalledWith(1, "/verify/account", {
      params: { username: "foo", flag: 0 },
    });
    expect(apiClient.get).toHaveBeenNthCalledWith(2, "/verify/account", {
      params: { username: "bar", flag: 1 },
    });
    expect(apiClient.get).toHaveBeenNthCalledWith(3, "/verify/account", {
      params: { username: "baz", flag: 2 },
    });
  });

  it("chooses the correct header when sending mail or captcha", () => {
    sendMail("ticket-a");
    sendMail("ticket-b", "reset");
    verifyCaptcha("ticket-c", "123456");
    verifyCaptcha("ticket-d", "654321", "reset");

    expect(apiClient.get).toHaveBeenNthCalledWith(1, "/sendEmail", {
      headers: { "REGISTER-TICKET": "ticket-a" },
    });
    expect(apiClient.get).toHaveBeenNthCalledWith(2, "/sendEmail", {
      headers: { "RESETPWD-TICKET": "ticket-b" },
    });
    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      "/verify/captcha",
      "captcha=S-123456",
      {
        headers: {
          "REGISTER-TICKET": "ticket-c",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      },
    );
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      "/verify/captcha",
      "captcha=S-654321",
      {
        headers: {
          "RESETPWD-TICKET": "ticket-d",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      },
    );
  });

  it("posts register and reset payloads with the expected body and headers", () => {
    userRegister("secret", "register-ticket");
    resetPassword("new-secret", "reset-ticket");

    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      "/user/register",
      "password=secret",
      {
        headers: { "REGISTER-TICKET": "register-ticket" },
      },
    );
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      "/user/resetPassword",
      "newPassword=new-secret",
      {
        headers: { "RESETPWD-TICKET": "reset-ticket" },
      },
    );
  });

  it("passes OAuth callback params through unchanged", () => {
    getFeishuLoginStatus("code-1", "state-1");
    getGithubLoginStatus("code-2", "state-2");

    expect(apiClient.get).toHaveBeenNthCalledWith(1, "/login/lark/callback", {
      params: { code: "code-1", state: "state-1" },
    });
    expect(apiClient.get).toHaveBeenNthCalledWith(2, "/login/github/callback", {
      params: { code: "code-2", state: "state-2" },
    });
  });
});
