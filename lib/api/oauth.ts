import { getToken } from "@/lib/token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface OAuthParams {
  client_id: string | null;
  code_challenge: string | null;
  code_challenge_method: string | null;
  redirect_uri: string | null;
  response_type: string | null;
  scope: string | null;
  state: string | null;
}

/** Build OAuth authorize URL and redirect */
export function oAuth(data: OAuthParams) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value) params.append(key, value);
  }

  const token = getToken();
  if (token) {
    params.append("part", token);
  }

  window.location.href = `${API_BASE_URL}/oauth2/authorize?${params.toString()}`;
}
