import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { message } from "@/lib/message";

import { BindAppItem } from "./bind-app-item";

jest.mock("@/lib/message", () => ({
  message: {
    warning: jest.fn(),
  },
}));

describe("BindAppItem", () => {
  it("renders a bound badge when the app is already linked", () => {
    render(
      <BindAppItem
        iconSrc="/svg/qq.svg"
        iconAlt="QQ"
        title="QQ"
        bound
        darkModeIcon
      />,
    );

    expect(screen.getByAltText("QQ")).toHaveAttribute("src", "/svg/qq.svg");
    expect(screen.getByAltText("QQ")).toHaveClass("dark:invert");
    expect(screen.getByText("已绑定")).toBeInTheDocument();
  });

  it("shows an unbound badge and warns when binding is unavailable", async () => {
    const user = userEvent.setup();
    render(
      <BindAppItem
        iconSrc="/svg/ms.svg"
        iconAlt="Microsoft"
        title="Microsoft"
        bound={false}
      />,
    );

    await user.click(screen.getByText("未绑定"));
    expect(message.warning).toHaveBeenCalledWith("请退出并使用该方式登录绑定");
  });

  it("does not force invert on multicolor icons", () => {
    render(
      <BindAppItem
        iconSrc="/svg/ms.svg"
        iconAlt="Microsoft"
        title="Microsoft"
        bound
      />,
    );

    expect(screen.getByAltText("Microsoft")).not.toHaveClass("dark:invert");
  });
});
