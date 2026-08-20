import "server-only";
import { cookies } from "next/headers";

const ACCESS_COOKIE = "ivy_access";
const REFRESH_COOKIE = "ivy_refresh";

export type Session = {
  userId: string;
  email?: string;
  roles: string[];
};

// Decodes the JWT payload for UI purposes only (which nav/dashboard to show).
// This is never used to authorize a request — every real data call re-checks
// the token against the Identity service itself (ARCHITECTURE.md §7.2).
function decodeAccessToken(token: string): Session | null {
  try {
    const payload = token.split(".")[1];
    const json = Buffer.from(payload, "base64").toString("utf-8");
    const claims = JSON.parse(json);
    if (typeof claims.exp === "number" && claims.exp * 1000 < Date.now()) {
      return null;
    }
    return { userId: claims.sub, email: claims.email, roles: claims.roles ?? [] };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  return decodeAccessToken(token);
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value;
}

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value;
}

const isProd = process.env.NODE_ENV === "production";

export async function setSessionCookies(accessToken: string, refreshToken: string, accessTtlSeconds: number) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: accessTtlSeconds,
  });
  store.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}
