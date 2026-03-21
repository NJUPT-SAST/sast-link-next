import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoginStep1 from "./login-step-1";
import { verifyLoginAccount } from "@/lib/api/auth";

jest.mock("@/lib/api/auth", () => ({
  verifyLoginAccount: jest.fn(),
}));

jest.mock("@/lib/message", () => ({
  message: {
    warning: jest.fn(),
  },
}));

describe("LoginStep1", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects account values that are neither student ids nor emails", async () => {
    const user = userEvent.setup();

    render(<LoginStep1 onNext={jest.fn()} />);

    await user.type(screen.getByLabelText("账户"), "bad account");
    await user.click(screen.getByRole("button", { name: "下一步" }));

    expect(verifyLoginAccount).not.toHaveBeenCalled();
    expect(screen.getByText("请输入学号或邮箱")).toBeInTheDocument();
  });
});
