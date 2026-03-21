import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AccountPanel } from "./account-panel";

const accounts = [
  {
    token: "token-1",
    avatar: null,
    nickName: "Alice",
    email: "alice@example.com",
    userId: "user-1",
  },
  {
    token: "token-2",
    avatar: "/avatar-b.png",
    nickName: undefined,
    email: "bob@example.com",
    userId: "user-2",
  },
];

describe("AccountPanel", () => {
  it("renders accounts and highlights the selected item", () => {
    const { container } = render(
      <AccountPanel
        accounts={accounts}
        selectedIndex={1}
        onSelect={jest.fn()}
        onRemove={jest.fn()}
      />,
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("NJUPTer")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    expect(screen.getAllByAltText("avatar")).toHaveLength(2);

    const selectedRow = screen
      .getByText("bob@example.com")
      .closest('[tabindex="0"]');
    expect(selectedRow).toHaveClass("bg-[#f0f0f0]");
    expect(container.querySelectorAll('button[aria-label="Remove account"]')).toHaveLength(2);
  });

  it("emits select and remove callbacks for the matching account", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const onRemove = jest.fn();

    render(
      <AccountPanel
        accounts={accounts}
        selectedIndex={0}
        onSelect={onSelect}
        onRemove={onRemove}
      />,
    );

    await user.click(screen.getByText("bob@example.com"));
    expect(onSelect).toHaveBeenCalledWith(1);

    await user.click(screen.getAllByRole("button", { name: "Remove account" })[1]);
    expect(onRemove).toHaveBeenCalledWith(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
