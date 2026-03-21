import { render, screen } from "@testing-library/react";

import { MagicCard } from "./magic-card";

describe("MagicCard", () => {
  it("uses theme-aware foreground text by default", () => {
    render(<MagicCard>content</MagicCard>);

    const card = screen.getByText("content").closest('[data-slot="magic-card"]');

    expect(card).toHaveClass("text-card-foreground");
    expect(card).not.toHaveClass("text-black");
  });
});
