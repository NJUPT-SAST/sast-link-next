import { render, screen } from "@testing-library/react";

import { AuthShell } from "./auth-shell";

describe("AuthShell", () => {
  it("renders a shared auth heading, description, and step content region", () => {
    render(
      <AuthShell
        title="<Login>"
        description="使用你的 SAST Link 账号继续，支持学号或邮箱登录。"
      >
        <div>step content</div>
      </AuthShell>,
    );

    expect(
      screen.getByRole("heading", { name: "<Login>" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("使用你的 SAST Link 账号继续，支持学号或邮箱登录。"),
    ).toBeInTheDocument();
    expect(screen.getByText("step content")).toBeInTheDocument();
  });

  it("uses theme-aware shell colors instead of fixed light-mode surfaces", () => {
    const { container } = render(
      <AuthShell
        title="<Login>"
        description="使用你的 SAST Link 账号继续，支持学号或邮箱登录。"
      >
        <div>step content</div>
      </AuthShell>,
    );

    const section = container.querySelector("section");
    const panel = container.querySelector(".rounded-\\[24px\\]");
    const heading = screen.getByRole("heading", { name: "<Login>" });

    expect(section).toHaveClass("bg-background");
    expect(panel).toHaveClass("border-border");
    expect(panel).toHaveClass("bg-card");
    expect(heading).toHaveClass("text-foreground");
  });
});
