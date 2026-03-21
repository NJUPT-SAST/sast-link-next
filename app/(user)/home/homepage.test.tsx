import { fireEvent, render, screen } from "@testing-library/react";

import HomePage from "./page";
import ProfilePanel from "./@profilePanel/default";

const mockProfile = {
  nickname: "Alice",
  email: "alice@example.com",
  dep: "软件研发部",
  org: null,
  avatar: null,
  bio: "Full-stack developer",
  link: ["https://github.com/alice"],
  badge: null,
  hide: null,
};

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(() => ({ data: ["github"] })),
}));

jest.mock("@/store/use-user-profile-store", () => ({
  useUserProfileStore: (selector: (state: unknown) => unknown) =>
    selector({
      profile: mockProfile,
    }),
}));

jest.mock("@/lib/api/user", () => ({
  getUserBindStatus: jest.fn(async () => ({
    data: {
      Success: true,
      Data: ["github"],
    },
  })),
}));

describe("User homepage redesign", () => {
  beforeEach(() => {
    mockProfile.bio = "Full-stack developer";
    mockProfile.link = ["https://github.com/alice"];
  });

  it("renders overview content alongside application launchers", () => {
    render(<HomePage />);

    expect(screen.getByText("今日概览")).toBeInTheDocument();
    expect(screen.getByText("快速操作")).toBeInTheDocument();
    expect(screen.getByText("更多资料")).toBeInTheDocument();
    expect(screen.getByText("Full-stack developer")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /审批系统/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /SASTOJ/i })).toBeInTheDocument();
  });

  it("uses theme-aware classes for primary home cards", () => {
    render(<HomePage />);

    const overviewCard = screen
      .getByRole("heading", { name: "今日概览" })
      .closest('[data-slot="card"]');

    expect(overviewCard).toHaveClass("bg-card/80");
    expect(overviewCard).not.toHaveClass("bg-white/85");
  });

  it("keeps launcher card text theme-aware instead of forcing black text", () => {
    render(<HomePage />);

    const launcherCard = screen
      .getByRole("link", { name: /审批系统/i })
      .querySelector('[data-slot="magic-card"]');

    expect(launcherCard).toHaveClass("text-card-foreground");
    expect(launcherCard).not.toHaveClass("text-black");
  });

  it("applies dark-mode icon treatment only to monochrome launcher logos", () => {
    render(<HomePage />);

    expect(screen.getByAltText("SASTOJ")).toHaveClass("dark:invert");
    expect(screen.getByAltText("视觉科协")).toHaveClass("dark:invert");
    expect(screen.getByAltText("SAST Evento")).toHaveClass("dark:invert");
    expect(screen.getByAltText("审批系统")).not.toHaveClass("dark:invert");
  });

  it("renders a titled profile summary card with account actions", () => {
    render(<ProfilePanel />);

    expect(
      screen.getByRole("heading", { name: "个人资料" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "编辑信息" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "安全设置" })).toBeInTheDocument();
  });

  it("uses theme-aware classes for the profile summary card", () => {
    render(<ProfilePanel />);

    const profileCard = screen
      .getByRole("heading", { name: "个人资料" })
      .closest('[data-slot="card"]');

    expect(profileCard).toHaveClass("bg-card/80");
    expect(profileCard).not.toHaveClass("bg-white/80");
  });

  it("applies dark-mode icon treatment to monochrome binding icons", () => {
    render(<ProfilePanel />);

    expect(screen.getByAltText("QQ")).toHaveClass("dark:invert");
    expect(screen.getByAltText("GitHub")).toHaveClass("dark:invert");
    expect(screen.getByAltText("Microsoft")).not.toHaveClass("dark:invert");
  });

  it("allows long biographies to expand without breaking the default layout", () => {
    mockProfile.bio =
      "Alice builds internal tools, contributes to frontend architecture, maintains design system alignment, coordinates releases, and documents edge cases across multiple platforms.";

    render(<HomePage />);

    expect(
      screen.getByRole("button", { name: "展开更多" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "展开更多" }));

    expect(screen.getByText(/coordinates releases/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "收起简介" })).toBeInTheDocument();
  });
});
