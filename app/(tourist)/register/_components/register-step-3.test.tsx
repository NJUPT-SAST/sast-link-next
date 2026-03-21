import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RegisterStep3 from "./register-step-3";
import { userRegister } from "@/lib/api/auth";

jest.mock("@/lib/api/auth", () => ({
  userRegister: jest.fn(),
}));

describe("RegisterStep3", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("blocks weak passwords and explains the password requirements before submit", async () => {
    const user = userEvent.setup();

    render(<RegisterStep3 ticket="register-ticket" onNext={jest.fn()} />);

    expect(
      screen.getByText("请使用至少 8 位且同时包含字母和数字的密码。"),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText("密码"), "short");
    await user.type(screen.getByLabelText("确认密码"), "short");
    await user.click(screen.getByRole("button", { name: "下一步" }));

    await waitFor(() => {
      expect(userRegister).not.toHaveBeenCalled();
    });
    expect(
      screen.getByText("密码至少 8 位且需同时包含字母和数字"),
    ).toBeInTheDocument();
  });
});
