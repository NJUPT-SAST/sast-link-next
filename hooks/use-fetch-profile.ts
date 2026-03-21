"use client";

import useSWR from "swr";

import { getUserProfile } from "@/lib/api/user";
import { getToken } from "@/lib/token";
import { useUserProfileStore } from "@/store/use-user-profile-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useUserListStore } from "@/store/use-user-list-store";

/**
 * Hook that fetches user profile and populates Zustand stores.
 * Replaces the @getInfo parallel route anti-pattern.
 */
export function useFetchProfile() {
  const setProfile = useUserProfileStore((s) => s.setProfile);
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const updateAccount = useUserListStore((s) => s.updateAccount);

  return useSWR(
    () => (getToken() ? "getProfile" : null),
    async () => {
      const res = await getUserProfile();
      if (res.data.Success) {
        const data = res.data.Data;
        setProfile(data);
        setCurrentUser({ username: data.nickname, email: data.email });
        updateAccount({
          email: data.email,
          nickName: data.nickname,
          avatar: data.avatar,
        });
        return data;
      }
      throw new Error("Failed to fetch profile");
    },
    { revalidateOnFocus: false },
  );
}
