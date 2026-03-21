import { apiClient } from "./client";
import type { ResType } from "./types";

/** Verify account for registration (flag=0) */
export function verifyRegistAccount(username: string) {
  return apiClient.get<ResType<{ registerTicket: string }>>(
    "/verify/account",
    { params: { username, flag: 0 } },
  );
}

/** Verify account for login (flag=1) */
export function verifyLoginAccount(username: string) {
  return apiClient.get<ResType<{ loginTicket: string }>>(
    "/verify/account",
    { params: { username, flag: 1 } },
  );
}

/** Verify account for password reset (flag=2) */
export function verifyResetAccount(username: string) {
  return apiClient.get<ResType<{ resetPwdTicket: string }>>(
    "/verify/account",
    { params: { username, flag: 2 } },
  );
}

/** Send verification email */
export function sendMail(ticket: string, type?: "reset") {
  const headerKey = type === "reset" ? "RESETPWD-TICKET" : "REGISTER-TICKET";
  return apiClient.get<ResType<null>>("/sendEmail", {
    headers: { [headerKey]: ticket },
  });
}

/** Verify email captcha */
export function verifyCaptcha(
  ticket: string,
  captcha: string,
  type?: "reset",
) {
  const headerKey = type === "reset" ? "RESETPWD-TICKET" : "REGISTER-TICKET";
  const params = new URLSearchParams();
  params.append("captcha", "S-" + captcha);

  return apiClient.post<ResType<null>>("/verify/captcha", params.toString(), {
    headers: {
      [headerKey]: ticket,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });
}

/** Register a new user */
export function userRegister(password: string, registerTicket: string) {
  const params = new URLSearchParams();
  params.append("password", password);

  return apiClient.post<ResType<null>>("/user/register", params.toString(), {
    headers: { "REGISTER-TICKET": registerTicket },
  });
}

/** Reset password */
export function resetPassword(password: string, resetTicket: string) {
  const params = new URLSearchParams();
  params.append("newPassword", password);

  return apiClient.post<ResType<null>>(
    "/user/resetPassword",
    params.toString(),
    { headers: { "RESETPWD-TICKET": resetTicket } },
  );
}

/** Feishu/Lark OAuth callback */
export function getFeishuLoginStatus(code: string, state: string) {
  return apiClient.get(`/login/lark/callback`, { params: { code, state } });
}

/** GitHub OAuth callback */
export function getGithubLoginStatus(code: string, state: string) {
  return apiClient.get(`/login/github/callback`, { params: { code, state } });
}
