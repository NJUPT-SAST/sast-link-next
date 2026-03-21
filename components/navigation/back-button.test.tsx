import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BackButton } from "./back-button";

const back = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back,
  }),
}));

describe("BackButton", () => {
  beforeEach(() => {
    back.mockClear();
  });

  it("renders a back button and navigates backward on click", async () => {
    const user = userEvent.setup();
    render(<BackButton />);

    await user.click(screen.getByRole("button", { name: "返回" }));
    expect(back).toHaveBeenCalledTimes(1);
  });
});
