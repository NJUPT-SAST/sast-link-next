import { create } from "zustand";

import type { UserProfileType } from "@/lib/api/types";

interface EditableFields {
  nickname?: string;
  dep?: string | null;
  org?: string | null;
  bio?: string;
  link?: string[] | null;
  hide?: string[] | null;
}

interface UserProfileState {
  profile: UserProfileType;
  setProfile: (profile: UserProfileType) => void;
  // BUG FIX: Original spread `action` instead of `action.payload`
  updateProfile: (fields: EditableFields) => void;
  resetProfile: () => void;
}

const initialProfile: UserProfileType = {
  nickname: "~",
  email: "~",
  dep: null,
  org: null,
  avatar: null,
  bio: null,
  link: null,
  badge: null,
  hide: null,
};

export const useUserProfileStore = create<UserProfileState>()((set) => ({
  profile: initialProfile,

  setProfile: (profile) => set({ profile }),

  updateProfile: (fields) =>
    set((state) => ({
      profile: { ...state.profile, ...fields },
    })),

  resetProfile: () => set({ profile: initialProfile }),
}));
