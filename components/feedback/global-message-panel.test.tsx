import { render, screen } from "@testing-library/react";

import { GlobalMessagePanel } from "@/components/feedback/global-message-panel";

jest.mock("@/components/ui/sonner", () => ({
  Toaster: ({ position, ...props }: { position?: string }) => (
    <div data-testid="mock-toaster" data-position={position} {...props} />
  ),
}));

describe("GlobalMessagePanel", () => {
  it("renders the toaster with the expected position", () => {
    render(<GlobalMessagePanel />);

    expect(screen.getByTestId("global-message-panel")).toHaveAttribute(
      "data-position",
      "top-center",
    );
  });
});
