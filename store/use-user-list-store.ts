import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { UserAccount } from "@/lib/api/types";

interface UserListState {
  accounts: UserAccount[];
  addAccount: (account: UserAccount) => void;
  updateAccount: (update: {
    email: string;
    nickName: string;
    avatar: string | null;
  }) => void;
  /** Remove account by index or email */
  removeAccount: (identifier: number | string) => void;
}

export const useUserListStore = create<UserListState>()(
  persist(
    (set) => ({
      accounts: [],

      addAccount: (account) =>
        set((state) => {
          const exists = state.accounts.some(
            (a) => a.userId === account.userId,
          );
          if (exists) return state;
          return { accounts: [...state.accounts, account] };
        }),

      updateAccount: ({ email, nickName, avatar }) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.email === email ? { ...a, nickName, avatar } : a,
          ),
        })),

      // BUG FIX: Original had missing return in filter callback
      removeAccount: (identifier) =>
        set((state) => {
          if (typeof identifier === "number") {
            return {
              accounts: state.accounts.filter((_, i) => i !== identifier),
            };
          }
          return {
            accounts: state.accounts.filter((a) => a.email !== identifier),
          };
        }),
    }),
    { name: "user-list-store" },
  ),
);
