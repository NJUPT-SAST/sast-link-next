import { render, screen } from "@testing-library/react";

import LoginPage from "./page";

describe("LoginPage", () => {
  it("renders the primary login entry fields", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText("账户")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "下一步",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "注册" })).toBeInTheDocument();
  });
});
