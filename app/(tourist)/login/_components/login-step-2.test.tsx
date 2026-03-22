import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoginStep2 from "./login-step-2";
import { userLogin, getUserInfo } from "@/lib/api/user";
import { setToken } from "@/lib/token";

const pushMock = jest.fn();
const addAccountMock = jest.fn();
let searchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => searchParams,
}));

jest.mock("@/lib/api/user", () => ({
  userLogin: jest.fn(),
  getUserInfo: jest.fn(),
}));

jest.mock("@/lib/token", () => ({
  setToken: jest.fn(),
}));

jest.mock("@/store/use-user-list-store", () => ({
  useUserListStore: (selector: (state: { addAccount: typeof addAccountMock }) => unknown) =>
    selector({ addAccount: addAccountMock }),
}));

describe("LoginStep2", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    searchParams = new URLSearchParams();
  });

  it("logs in successfully, stores account info, and redirects to /home by default", async () => {
    const user = userEvent.setup();

    (userLogin as jest.Mock).mockResolvedValue({
      data: { Success: true, Data: { loginToken: "token-1" } },
    });
    (getUserInfo as jest.Mock).mockResolvedValue({
      data: { Success: true, Data: { email: "alice@example.com", userId: 7 } },
    });

    render(<LoginStep2 loginTicket="ticket-1" onBack={jest.fn()} />);

    await user.type(screen.getByLabelText("密码"), "pass1234");
    await user.click(screen.getByRole("button", { name: "登录 SAST Link" }));

    await waitFor(() => {
      expect(setToken).toHaveBeenCalledWith("token-1");
      expect(addAccountMock).toHaveBeenCalledWith({
        nickName: "NJUPTer",
        email: "alice@example.com",
        token: "token-1",
        userId: 7,
      });
      expect(pushMock).toHaveBeenCalledWith("/home");
    });
  });

  it("redirects to decoded redirect url and forwards oauth ticket to login api", async () => {
    const user = userEvent.setup();
    searchParams = new URLSearchParams({
      redirect: btoa("/oauth/callback"),
      oauthTicket: "oauth-ticket-1",
    });

    (userLogin as jest.Mock).mockResolvedValue({
      data: { Success: true, Data: { loginToken: "token-2" } },
    });
    (getUserInfo as jest.Mock).mockResolvedValue({
      data: { Success: true, Data: { email: "bob@example.com", userId: 9 } },
    });

    render(<LoginStep2 loginTicket="ticket-2" onBack={jest.fn()} />);

    await user.type(screen.getByLabelText("密码"), "pass5678");
    await user.click(screen.getByRole("button", { name: "登录并前往授权" }));

    await waitFor(() => {
      expect(userLogin).toHaveBeenCalledWith(
        "pass5678",
        "ticket-2",
        "oauth-ticket-1",
      );
      expect(pushMock).toHaveBeenCalledWith("/oauth/callback");
    });
  });

  it("calls onBack when backend asks user to re-enter account", async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();

    (userLogin as jest.Mock).mockResolvedValue({
      data: { Success: false, ErrCode: 20007, ErrMsg: "需要重新验证账户" },
    });

    render(<LoginStep2 loginTicket="ticket-3" onBack={onBack} />);

    await user.type(screen.getByLabelText("密码"), "pass9999");
    await user.click(screen.getByRole("button", { name: "登录 SAST Link" }));

    await waitFor(() => {
      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });

  it("shows backend password error when login fails with normal error code", async () => {
    const user = userEvent.setup();

    (userLogin as jest.Mock).mockResolvedValue({
      data: { Success: false, ErrCode: 12345, ErrMsg: "后端密码校验失败" },
    });

    render(<LoginStep2 loginTicket="ticket-4" onBack={jest.fn()} />);

    await user.type(screen.getByLabelText("密码"), "pass0000");
    await user.click(screen.getByRole("button", { name: "登录 SAST Link" }));

    expect(await screen.findByText("后端密码校验失败")).toBeInTheDocument();
  });

  it("shows dedicated error for 401 responses", async () => {
    const user = userEvent.setup();

    (userLogin as jest.Mock).mockRejectedValue({ response: { status: 401 } });

    render(<LoginStep2 loginTicket="ticket-5" onBack={jest.fn()} />);

    await user.type(screen.getByLabelText("密码"), "pass1111");
    await user.click(screen.getByRole("button", { name: "登录 SAST Link" }));

    expect(await screen.findByText("密码错误，请重新输入密码")).toBeInTheDocument();
  });

  it("shows network error when profile fetch fails after login", async () => {
    const user = userEvent.setup();

    (userLogin as jest.Mock).mockResolvedValue({
      data: { Success: true, Data: { loginToken: "token-6" } },
    });
    (getUserInfo as jest.Mock).mockResolvedValue({
      data: { Success: false, ErrMsg: "获取用户信息失败" },
    });

    render(<LoginStep2 loginTicket="ticket-6" onBack={jest.fn()} />);

    await user.type(screen.getByLabelText("密码"), "pass2222");
    await user.click(screen.getByRole("button", { name: "登录 SAST Link" }));

    expect(await screen.findByText("获取用户信息失败")).toBeInTheDocument();
  });
});
