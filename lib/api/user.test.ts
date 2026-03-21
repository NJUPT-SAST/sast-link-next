jest.mock("./client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import { apiClient } from "./client";
import {
  editProfile,
  getUserBindStatus,
  getUserInfo,
  getUserProfile,
  uploadAvatar,
  userLogin,
  userLogout,
} from "./user";

describe("lib/api/user", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("logs in with form data and optional oauth header", () => {
    userLogin("secret", "ticket-a");
    userLogin("secret", "ticket-b", "oauth-ticket");

    const firstBody = (apiClient.post as jest.Mock).mock.calls[0][1] as FormData;
    const secondBody = (apiClient.post as jest.Mock).mock.calls[1][1] as FormData;

    expect(firstBody.get("password")).toBe("secret");
    expect(secondBody.get("password")).toBe("secret");

    expect(apiClient.post).toHaveBeenNthCalledWith(1, "/user/login", firstBody, {
      headers: { "LOGIN-TICKET": "ticket-a" },
    });
    expect(apiClient.post).toHaveBeenNthCalledWith(2, "/user/login", secondBody, {
      headers: {
        "LOGIN-TICKET": "ticket-b",
        "OAUTH-TICKET": "oauth-ticket",
      },
    });
  });

  it("wraps basic profile endpoints with the expected routes", () => {
    getUserInfo();
    getUserProfile();
    getUserBindStatus();
    userLogout();
    editProfile({ nickname: "Alice", bio: "Hello" });

    expect(apiClient.get).toHaveBeenNthCalledWith(1, "/user/info");
    expect(apiClient.get).toHaveBeenNthCalledWith(2, "/profile/getProfile");
    expect(apiClient.get).toHaveBeenNthCalledWith(3, "/profile/bindStatus");
    expect(apiClient.post).toHaveBeenNthCalledWith(1, "/user/logout", {});
    expect(apiClient.post).toHaveBeenNthCalledWith(2, "/profile/changeProfile", {
      nickname: "Alice",
      bio: "Hello",
    });
  });

  it("uploads avatar files as form data", async () => {
    const file = new Blob(["avatar"], { type: "image/png" });

    uploadAvatar(file);

    const body = (apiClient.post as jest.Mock).mock.calls[0][1] as FormData;
    const uploaded = body.get("avatarFile") as File;

    expect(uploaded?.constructor.name).toBe("File");
    expect(uploaded.type).toBe("image/png");
    await expect(uploaded.text()).resolves.toBe("avatar");
    expect(apiClient.post).toHaveBeenNthCalledWith(1, "/profile/uploadAvatar", body);
  });
});
