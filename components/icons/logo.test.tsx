import { render, screen } from "@testing-library/react";

import { Logo } from "./logo";

describe("Logo", () => {
  it("renders the SAST Link wordmark", () => {
    const { container } = render(<Logo />);

    expect(screen.getByText("SAST Link")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 100 24");
  });
});
