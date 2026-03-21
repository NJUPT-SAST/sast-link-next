import { render, screen } from "@testing-library/react";

import { PageTransition } from "./page-transition";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      initial,
      animate,
      exit,
      transition,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      transition?: unknown;
    }) => (
      <div
        data-testid="motion-div"
        data-initial={JSON.stringify(initial)}
        data-animate={JSON.stringify(animate)}
        data-exit={JSON.stringify(exit)}
        data-transition={JSON.stringify(transition)}
        {...props}
      >
        {children}
      </div>
    ),
  },
}));

describe("PageTransition", () => {
  it("renders children with the default right-to-left animation", () => {
    render(<PageTransition>content</PageTransition>);

    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveTextContent("content");
    expect(motionDiv).toHaveAttribute(
      "data-initial",
      JSON.stringify({ opacity: 0, x: 10, y: 0 }),
    );
    expect(motionDiv).toHaveAttribute(
      "data-exit",
      JSON.stringify({ opacity: 0, x: -10, y: 0 }),
    );
  });

  it("passes style, className and the selected variant to motion.div", () => {
    render(
      <PageTransition
        position="topToBottom"
        className="panel"
        style={{ opacity: 0.5 }}
      >
        animated
      </PageTransition>,
    );

    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveClass("panel");
    expect(motionDiv).toHaveStyle({ opacity: "0.5" });
    expect(motionDiv).toHaveAttribute(
      "data-initial",
      JSON.stringify({ opacity: 0, x: 0, y: -10 }),
    );
    expect(motionDiv).toHaveAttribute(
      "data-animate",
      JSON.stringify({ opacity: 1, x: 0, y: 0 }),
    );
  });
});
