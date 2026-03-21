/**
 * Centralized token access utilities.
 * Fixes unsafe JSON.parse(localStorage.getItem("Token") ?? "") pattern
 * that throws on empty string.
 */

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("Token");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  localStorage.setItem("Token", JSON.stringify(token));
}

export function clearToken(): void {
  localStorage.removeItem("Token");
}
