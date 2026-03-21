import { render, screen } from "@testing-library/react";

import RegisterPage from "./page";

describe("RegisterPage", () => {
  it("renders the shared auth shell with registration guidance", () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole("heading", { name: "<Register>" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("完成邮箱验证与密码设置后即可开始使用 SAST Link。"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("学生邮箱")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "下一步" })).toBeInTheDocument();
  });
});
