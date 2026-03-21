import { render, screen } from "@testing-library/react";

import { GithubIcon, LarkIcon, MsIcon, QqIcon } from "./brand-icons";

describe("brand icons", () => {
  it("renders the Github svg icon", () => {
    const { container } = render(<GithubIcon />);

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("path")).toHaveAttribute("fill", "currentColor");
  });

  it("renders raster icons with the expected alt text and sources", () => {
    render(
      <>
        <QqIcon />
        <MsIcon />
        <LarkIcon />
      </>,
    );

    expect(screen.getByAltText("QQ")).toHaveAttribute("src", "/svg/qq.svg");
    expect(screen.getByAltText("QQ")).toHaveClass("dark:invert");
    expect(screen.getByAltText("Microsoft")).toHaveAttribute("src", "/svg/ms.svg");
    expect(screen.getByAltText("Microsoft")).not.toHaveClass("dark:invert");
    expect(screen.getByAltText("Feishu")).toHaveAttribute("src", "/svg/feishu.svg");
    expect(screen.getByAltText("Feishu")).toHaveClass("dark:invert");
  });
});
