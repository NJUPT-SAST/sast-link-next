import { render } from "@testing-library/react";

import { BackLayout } from "./back-layout";

describe("BackLayout", () => {
  it("renders all desktop gradient layers and defaults the mobile layer to yellow", () => {
    const { container } = render(<BackLayout />);
    const divs = Array.from(container.querySelectorAll("div"));
    const classNames = divs.map((element) => element.className).join(" ");
    const gradientDivs = divs.filter((element) =>
      String(element.className).includes("bg-[radial-gradient"),
    );

    expect(classNames).toContain("#20afff");
    expect(classNames).toContain("#ffce20");
    expect(classNames).toContain("#ff8b20");
    expect(classNames).toContain("#20ffd7");
    expect(gradientDivs).toHaveLength(5);
  });

  it("switches the mobile highlight to the requested gradient", () => {
    const { container } = render(<BackLayout type="blue" />);
    const divs = Array.from(container.querySelectorAll("div"));
    const mobileGradient = divs.find((element) =>
      String(element.className).includes("sm:hidden"),
    )?.firstElementChild as HTMLDivElement | null;

    expect(mobileGradient.className).toContain("#20afff");
  });
});
