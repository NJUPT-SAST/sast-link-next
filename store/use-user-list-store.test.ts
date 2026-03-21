import { useUserListStore } from "./use-user-list-store";

const alice = {
  token: "token-1",
  avatar: null,
  nickName: "Alice",
  email: "alice@example.com",
  userId: "user-1",
};

const bob = {
  token: "token-2",
  avatar: "/bob.png",
  nickName: "Bob",
  email: "bob@example.com",
  userId: "user-2",
};

describe("useUserListStore", () => {
  beforeEach(() => {
    useUserListStore.setState({ accounts: [] });
  });

  it("adds accounts and ignores duplicates by userId", () => {
    useUserListStore.getState().addAccount(alice);
    useUserListStore.getState().addAccount(alice);
    useUserListStore.getState().addAccount(bob);

    expect(useUserListStore.getState().accounts).toEqual([alice, bob]);
  });

  it("updates the matching account by email", () => {
    useUserListStore.setState({ accounts: [alice, bob] });

    useUserListStore.getState().updateAccount({
      email: "bob@example.com",
      nickName: "Bobby",
      avatar: "/new-bob.png",
    });

    expect(useUserListStore.getState().accounts).toEqual([
      alice,
      {
        ...bob,
        nickName: "Bobby",
        avatar: "/new-bob.png",
      },
    ]);
  });

  it("removes accounts by either index or email", () => {
    useUserListStore.setState({ accounts: [alice, bob] });

    useUserListStore.getState().removeAccount(0);
    expect(useUserListStore.getState().accounts).toEqual([bob]);

    useUserListStore.setState({ accounts: [alice, bob] });
    useUserListStore.getState().removeAccount("bob@example.com");
    expect(useUserListStore.getState().accounts).toEqual([alice]);
  });
});
