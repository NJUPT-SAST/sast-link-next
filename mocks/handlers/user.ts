import { http, HttpResponse } from "msw";

import { getTicketEntry, deleteTicket } from "../data/tickets";
import { findUserByToken, findUserByUsername } from "../data/users";

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

export const userHandlers = [
  // POST /user/login
  http.post(`${BASE}/user/login`, async ({ request }) => {
    const loginTicket = request.headers.get("LOGIN-TICKET");
    if (!loginTicket) return error(401, "Missing LOGIN-TICKET");

    const entry = getTicketEntry(loginTicket);
    if (!entry) return error(401, "Invalid LOGIN-TICKET");

    const user = findUserByUsername(entry.username);
    if (!user) return error(404, "User not found");

    const formData = await request.formData();
    const password = formData.get("password");
    if (password !== user.password) return error(401, "Invalid password");

    deleteTicket(loginTicket);
    return success({ loginToken: user.token });
  }),

  // GET /user/info
  http.get(`${BASE}/user/info`, ({ request }) => {
    const token = request.headers.get("Token");
    if (!token) return error(401, "Unauthorized");

    const user = findUserByToken(token);
    if (!user) return error(401, "Invalid token");

    return success({ email: user.email, userId: user.userId });
  }),

  // POST /user/logout
  http.post(`${BASE}/user/logout`, () => {
    return success(null);
  }),

  // GET /profile/getProfile
  http.get(`${BASE}/profile/getProfile`, ({ request }) => {
    const token = request.headers.get("Token");
    if (!token) return error(401, "Unauthorized");

    const user = findUserByToken(token);
    if (!user) return error(401, "Invalid token");

    return success(user.profile);
  }),

  // POST /profile/changeProfile
  http.post(`${BASE}/profile/changeProfile`, ({ request }) => {
    const token = request.headers.get("Token");
    if (!token) return error(401, "Unauthorized");

    const user = findUserByToken(token);
    if (!user) return error(401, "Invalid token");

    return success(null);
  }),

  // POST /profile/uploadAvatar
  http.post(`${BASE}/profile/uploadAvatar`, ({ request }) => {
    const token = request.headers.get("Token");
    if (!token) return error(401, "Unauthorized");

    return success({ filePath: "/defaultAvatar.png" });
  }),

  // GET /profile/bindStatus
  http.get(`${BASE}/profile/bindStatus`, ({ request }) => {
    const token = request.headers.get("Token");
    if (!token) return error(401, "Unauthorized");

    const user = findUserByToken(token);
    if (!user) return error(401, "Invalid token");

    return success(user.bindStatus);
  }),
];
