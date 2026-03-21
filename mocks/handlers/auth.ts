import { http, HttpResponse } from "msw";

import {
  issueTicket,
  getTicketEntry,
  markVerified,
  deleteTicket,
} from "../data/tickets";
import { findUserByUsername } from "../data/users";

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://118.25.23.101:8081/api/v1";

function success<T>(data: T) {
  return HttpResponse.json({ Success: true, Data: data });
}

function error(code: number, msg: string) {
  return HttpResponse.json({
    Success: false,
    ErrCode: code,
    ErrMsg: msg,
    Data: null,
  });
}

export const authHandlers = [
  // GET /verify/account?username=X&flag=N
  http.get(`${BASE}/verify/account`, ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    const flag = url.searchParams.get("flag");

    if (!username) return error(400, "username is required");

    switch (flag) {
      case "0": {
        if (findUserByUsername(username))
          return error(409, "User already exists");
        return success({ registerTicket: issueTicket(username, "reg") });
      }
      case "1": {
        if (!findUserByUsername(username))
          return error(404, "User not found");
        return success({ loginTicket: issueTicket(username, "login") });
      }
      case "2": {
        if (!findUserByUsername(username))
          return error(404, "User not found");
        return success({ resetPwdTicket: issueTicket(username, "reset") });
      }
      default:
        return error(400, "Invalid flag");
    }
  }),

  // GET /sendEmail
  http.get(`${BASE}/sendEmail`, ({ request }) => {
    const regTicket = request.headers.get("REGISTER-TICKET");
    const resetTicket = request.headers.get("RESETPWD-TICKET");
    const ticket = regTicket || resetTicket;

    if (!ticket || !getTicketEntry(ticket))
      return error(401, "Invalid ticket");

    return success(null);
  }),

  // POST /verify/captcha
  http.post(`${BASE}/verify/captcha`, async ({ request }) => {
    const regTicket = request.headers.get("REGISTER-TICKET");
    const resetTicket = request.headers.get("RESETPWD-TICKET");
    const ticket = regTicket || resetTicket;

    if (!ticket || !getTicketEntry(ticket))
      return error(401, "Invalid ticket");

    // Accept any captcha in mock mode
    markVerified(ticket);
    return success(null);
  }),

  // POST /user/register
  http.post(`${BASE}/user/register`, async ({ request }) => {
    const ticket = request.headers.get("REGISTER-TICKET");
    if (!ticket) return error(401, "Missing REGISTER-TICKET");

    const entry = getTicketEntry(ticket);
    if (!entry || !entry.verified)
      return error(403, "Captcha not verified");

    deleteTicket(ticket);
    return success(null);
  }),

  // POST /user/resetPassword
  http.post(`${BASE}/user/resetPassword`, async ({ request }) => {
    const ticket = request.headers.get("RESETPWD-TICKET");
    if (!ticket) return error(401, "Missing RESETPWD-TICKET");

    const entry = getTicketEntry(ticket);
    if (!entry || !entry.verified)
      return error(403, "Captcha not verified");

    deleteTicket(ticket);
    return success(null);
  }),

  // GET /login/lark/callback
  http.get(`${BASE}/login/lark/callback`, ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (!code) return error(400, "Missing code");

    if (code.startsWith("bind-")) {
      return success({ oauthTicket: `oauth-lark-${code}` });
    }
    return success({ loginToken: "mock-token-alice-abc123" });
  }),

  // GET /login/github/callback
  http.get(`${BASE}/login/github/callback`, ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (!code) return error(400, "Missing code");

    if (code.startsWith("bind-")) {
      return success({ oauthTicket: `oauth-github-${code}` });
    }
    return success({ loginToken: "mock-token-alice-abc123" });
  }),
];
