jest.mock("@/lib/token", () => ({
  clearToken: jest.fn(),
}));

import { clearToken } from "@/lib/token";

import { useAuthStore } from "./use-auth-store";

describe("useAuthStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      currentUser: { username: "", email: "" },
      loginTicket: null,
      redirect: null,
    });
  });

  it("updates and clears the current user", () => {
    useAuthStore.getState().setCurrentUser({
      username: "Alice",
      email: "alice@example.com",
    });

    expect(useAuthStore.getState().currentUser).toEqual({
      username: "Alice",
      email: "alice@example.com",
    });

    useAuthStore.getState().clearCurrentUser();
    expect(useAuthStore.getState().currentUser).toEqual({
      username: "",
      email: "",
    });
  });

  it("stores and clears login flow state", () => {
    useAuthStore.getState().setLoginTicket("ticket-1");
    useAuthStore.getState().setRedirect("/home");

    expect(useAuthStore.getState().loginTicket).toBe("ticket-1");
    expect(useAuthStore.getState().redirect).toBe("/home");

    useAuthStore.getState().clearLoginState();
    expect(useAuthStore.getState().loginTicket).toBeNull();
    expect(useAuthStore.getState().redirect).toBeNull();
  });

  it("logs out by clearing token and resetting all auth state", () => {
    useAuthStore.setState({
      currentUser: { username: "Alice", email: "alice@example.com" },
      loginTicket: "ticket-1",
      redirect: "/home",
    });

    useAuthStore.getState().logout();

    expect(clearToken).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState()).toMatchObject({
      currentUser: { username: "", email: "" },
      loginTicket: null,
      redirect: null,
    });
  });

  it("persists only the current user snapshot", () => {
    const partialize = useAuthStore.persist.getOptions().partialize;

    const persisted = partialize?.({
      ...useAuthStore.getState(),
      currentUser: { username: "Alice", email: "alice@example.com" },
      loginTicket: "ticket-1",
      redirect: "/home",
    });

    expect(persisted).toEqual({
      currentUser: { username: "Alice", email: "alice@example.com" },
    });
  });
});
