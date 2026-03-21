import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { VeriCode } from "./verification-code-input";

describe("VeriCode", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("counts down before allowing resend", () => {
    render(<VeriCode onResend={jest.fn().mockResolvedValue(undefined)} />);

    expect(screen.getByText("60s 后重新发送")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(61_000);
    });

    expect(screen.getByText("重新发送")).toBeInTheDocument();
    expect(screen.getByText("重新发送")).toHaveClass("cursor-pointer");
  });

  it("calls onResend and resets the countdown after clicking resend", async () => {
    const onResend = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<VeriCode onResend={onResend} />);

    act(() => {
      jest.advanceTimersByTime(61_000);
    });

    await user.click(screen.getByText("重新发送"));

    await waitFor(() => {
      expect(onResend).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByText("60s 后重新发送")).toBeInTheDocument();
  });

  it("uses semantic foreground colors for disabled and enabled states", () => {
    const { rerender } = render(
      <VeriCode onResend={jest.fn().mockResolvedValue(undefined)} />,
    );

    expect(screen.getByText("60s 后重新发送")).toHaveClass(
      "pointer-events-none",
      "text-muted-foreground",
    );

    act(() => {
      jest.advanceTimersByTime(61_000);
    });

    rerender(<VeriCode onResend={jest.fn().mockResolvedValue(undefined)} />);

    expect(screen.getByText("重新发送")).toHaveClass(
      "cursor-pointer",
      "text-primary",
    );
  });
});
