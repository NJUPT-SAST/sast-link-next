import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TopBar } from "./top-bar";

const setHomeInfoPanel = jest.fn();
const setTheme = jest.fn();
let currentTheme = "light";

jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: currentTheme,
    setTheme,
  }),
}));

jest.mock("@/store/use-panel-store", () => ({
  usePanelStore: (selector: (state: { setHomeInfoPanel: typeof setHomeInfoPanel }) => unknown) =>
    selector({ setHomeInfoPanel }),
}));

jest.mock("@/store/use-user-profile-store", () => ({
  useUserProfileStore: (
    selector: (state: { profile: { avatar: string | null; nickname?: string } }) => unknown,
  ) =>
    selector({
      profile: {
        avatar: null,
        nickname: "Alice",
      },
    }),
}));

describe("TopBar", () => {
  beforeEach(() => {
    setHomeInfoPanel.mockClear();
    setTheme.mockClear();
    currentTheme = "light";
  });

  it("renders the logo, avatar fallback and profile trigger", async () => {
    const user = userEvent.setup();
    render(<TopBar />);

    expect(screen.getByText("SAST Link")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open profile" }));
    expect(setHomeInfoPanel).toHaveBeenCalledWith(true);
  });

  it("renders a spacer after the fixed header", () => {
    const { container } = render(<TopBar />);
    const spacer = container.querySelector(".h-14.w-px");

    expect(spacer).toBeInTheDocument();
  });

  it("renders a shared theme toggle and switches to dark mode", async () => {
    const user = userEvent.setup();
    render(<TopBar />);

    await user.click(screen.getByRole("button", { name: "主题模式" }));
    await user.click(screen.getByRole("menuitemradio", { name: "深色" }));

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("offers switching back to light mode when dark mode is active", async () => {
    const user = userEvent.setup();
    currentTheme = "dark";

    render(<TopBar />);

    await user.click(screen.getByRole("button", { name: "主题模式" }));
    await user.click(screen.getByRole("menuitemradio", { name: "浅色" }));

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("allows following the system theme", async () => {
    const user = userEvent.setup();
    currentTheme = "light";

    render(<TopBar />);

    await user.click(screen.getByRole("button", { name: "主题模式" }));
    await user.click(screen.getByRole("menuitemradio", { name: "跟随系统" }));

    expect(setTheme).toHaveBeenCalledWith("system");
  });

  it("uses theme-aware surface classes for the fixed header", () => {
    const { container } = render(<TopBar />);
    const header = container.querySelector(".fixed.top-0.left-0");

    expect(header).toHaveClass("bg-background/80");
    expect(header).toHaveClass("border-border/60");
    expect(header).not.toHaveClass("bg-white/50");
  });
});
