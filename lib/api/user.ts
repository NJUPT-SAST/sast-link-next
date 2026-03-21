import { apiClient } from "./client";
import type { EditableProfileType, ResType, UserProfileType } from "./types";

/** User login with password */
export function userLogin(
  password: string,
  loginTicket: string,
  oauthTicket?: string | null,
) {
  const formData = new FormData();
  formData.append("password", password);

  const headers: Record<string, string> = { "LOGIN-TICKET": loginTicket };
  if (oauthTicket) {
    headers["OAUTH-TICKET"] = oauthTicket;
  }

  return apiClient.post<ResType<{ loginToken: string }>>(
    "/user/login",
    formData,
    { headers },
  );
}

/** Get basic user info (email + userId) */
export function getUserInfo() {
  return apiClient.get<ResType<{ email: string; userId: string }>>(
    "/user/info",
  );
}

/** User logout */
export function userLogout() {
  return apiClient.post<ResType<null>>("/user/logout", {});
}

/** Get full user profile */
export function getUserProfile() {
  return apiClient.get<ResType<UserProfileType>>("/profile/getProfile");
}

/** Update user profile */
export function editProfile(data: EditableProfileType) {
  return apiClient.post<ResType<null>>("/profile/changeProfile", { ...data });
}

/** Upload user avatar */
export function uploadAvatar(file: Blob) {
  const formData = new FormData();
  formData.append("avatarFile", file);
  return apiClient.post<ResType<{ filePath: string }>>(
    "/profile/uploadAvatar",
    formData,
  );
}

/** Get user OAuth bind status */
export function getUserBindStatus() {
  return apiClient.get<ResType<string[]>>("/profile/bindStatus");
}
