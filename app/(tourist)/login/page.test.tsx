import { render, screen } from "@testing-library/react";

import LoginPage from "./page";

describe("LoginPage", () => {
  it("renders the shared auth shell with login guidance and the primary entry fields", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("heading", { name: "<Login>" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("使用你的 SAST Link 账号继续，支持学号或邮箱登录。"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("账户")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "下一步",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "注册" })).toBeInTheDocument();
  });
});
