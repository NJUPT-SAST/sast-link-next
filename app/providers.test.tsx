import type { ComponentProps, ReactNode } from "react";
import { render, screen } from "@testing-library/react";

const mockThemeProvider = jest.fn(
  ({
    children,
    attribute,
    defaultTheme,
    enableSystem,
  }: ComponentProps<"div"> & {
    children: ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
  }) => (
    <div
      data-testid="theme-provider"
      data-attribute={attribute}
      data-default-theme={defaultTheme}
      data-enable-system={String(enableSystem)}
    >
      {children}
    </div>
  ),
);

jest.mock("next-themes", () => ({
  ThemeProvider: (props: ComponentProps<"div"> & { children: ReactNode }) =>
    mockThemeProvider(props),
}));

import { Providers } from "./providers";

describe("Providers", () => {
  beforeEach(() => {
    mockThemeProvider.mockClear();
  });

  it("wraps children and renders them", () => {
    render(
      <Providers>
        <div>child content</div>
      </Providers>
    );

    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("renders the toast notification area", () => {
    const { container } = render(
      <Providers>
        <div>test</div>
      </Providers>
    );

    // Sonner renders an aria-live region for notifications
    const notifications = container.querySelector('[aria-label]');
    expect(notifications).toBeInTheDocument();
  });

  it("wraps the app with a class-based theme provider", () => {
    render(
      <Providers>
        <div>theme child</div>
      </Providers>,
    );

    const provider = screen.getByTestId("theme-provider");

    expect(provider).toHaveAttribute("data-attribute", "class");
    expect(provider).toHaveAttribute("data-default-theme", "system");
    expect(provider).toHaveAttribute("data-enable-system", "true");
    expect(screen.getByText("theme child")).toBeInTheDocument();
  });
});
