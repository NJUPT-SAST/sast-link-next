import { render, screen } from "@testing-library/react";

import { Footer } from "./footer";

describe("Footer", () => {
  it("renders children inside a footer landmark", () => {
    render(
      <Footer>
        <button type="button">Continue</button>
      </Footer>,
    );

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });
});
