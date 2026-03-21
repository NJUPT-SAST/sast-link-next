import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CurrentUserProfile } from "@/lib/api/types";
import { clearToken } from "@/lib/token";

interface AuthState {
  /** Current logged-in user basic info */
  currentUser: CurrentUserProfile;
  /** Login flow ticket */
  loginTicket: string | null;
  /** Post-login redirect URL */
  redirect: string | null;

  setCurrentUser: (user: CurrentUserProfile) => void;
  clearCurrentUser: () => void;
  setLoginTicket: (ticket: string) => void;
  setRedirect: (redirect: string) => void;
  clearLoginState: () => void;
  logout: () => void;
}

const emptyUser: CurrentUserProfile = { username: "", email: "" };

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: emptyUser,
      loginTicket: null,
      redirect: null,

      setCurrentUser: (user) => set({ currentUser: user }),

      clearCurrentUser: () => set({ currentUser: emptyUser }),

      setLoginTicket: (ticket) => set({ loginTicket: ticket }),

      setRedirect: (redirect) => set({ redirect }),

      clearLoginState: () => set({ loginTicket: null, redirect: null }),

      logout: () => {
        clearToken();
        set({ currentUser: emptyUser, loginTicket: null, redirect: null });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    },
  ),
);
