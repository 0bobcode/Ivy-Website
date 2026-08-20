const BASE_URL = process.env.IDENTITY_API_URL ?? "http://localhost:8081";

export class IdentityApiError extends Error {
  status: number;
  code?: string;
  fields?: string[];

  constructor(status: number, message: string, code?: string, fields?: string[]) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const body = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    throw new IdentityApiError(
      res.status,
      body?.detail ?? "Something went wrong. Please try again.",
      body?.code,
      body?.fields
    );
  }
  return body as T;
}

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
};

export const identityApi = {
  signup: (email: string, password: string, captchaToken?: string) =>
    request<void>("/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, captchaToken }),
    }),

  login: (email: string, password: string, mfaCode?: string) =>
    request<TokenResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, mfaCode }),
    }),

  refresh: (refreshToken: string) =>
    request<TokenResponse>("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  logout: (refreshToken: string) =>
    request<void>("/api/v1/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  requestPasswordReset: (email: string) =>
    request<{ devResetToken?: string }>("/api/v1/auth/password-reset/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  completePasswordReset: (token: string, newPassword: string) =>
    request<void>("/api/v1/auth/password-reset/complete", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    }),

  mfaEnroll: (accessToken: string) =>
    request<{ secret: string; otpAuthUri: string }>("/api/v1/auth/mfa/enroll", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  mfaConfirm: (accessToken: string, code: string) =>
    request<void>("/api/v1/auth/mfa/confirm", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ code }),
    }),

  me: (accessToken: string) =>
    request<{ id: string; email: string; mfaEnabled: boolean; roles: string[] }>("/api/v1/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  listTenants: (accessToken: string) =>
    request<TenantSummary[]>("/api/v1/tenants", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  createTenant: (accessToken: string, name: string) =>
    request<TenantSummary>("/api/v1/tenants", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ name }),
    }),

  // SAD-01
  myTenant: (accessToken: string) =>
    request<TenantSummary>("/api/v1/tenants/mine", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  updateTenant: (accessToken: string, tenantId: string, body: { name: string; logoUrl?: string; description?: string }) =>
    request<TenantSummary>(`/api/v1/tenants/${tenantId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    }),

  // SAD-02
  inviteTeacher: (accessToken: string, tenantId: string, email: string) =>
    request<InviteTeacherResponse>(`/api/v1/tenants/${tenantId}/invite-teacher`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ email }),
    }),

  tenantMembers: (accessToken: string, tenantId: string) =>
    request<TenantMemberSummary[]>(`/api/v1/tenants/${tenantId}/members`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  // SAD-09
  updateMemberStatus: (accessToken: string, tenantId: string, userId: string, status: "ACTIVE" | "SUSPENDED") =>
    request<TenantMemberSummary>(`/api/v1/tenants/${tenantId}/members/${userId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ status }),
    }),

  // PAR-01 / PAR-02
  myGuardianLinks: (accessToken: string) =>
    request<GuardianLinkSummary[]>("/api/v1/guardian-links/mine", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  linkChild: (accessToken: string, studentEmail: string) =>
    request<GuardianLinkSummary>("/api/v1/guardian-links", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ studentEmail }),
    }),

  grantConsent: (accessToken: string, linkId: string) =>
    request<GuardianLinkSummary>(`/api/v1/guardian-links/${linkId}/consent`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  revokeConsent: (accessToken: string, linkId: string) =>
    request<GuardianLinkSummary>(`/api/v1/guardian-links/${linkId}/revoke`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};

export type TenantSummary = {
  id: string;
  name: string;
  status: string;
  logoUrl: string | null;
  description: string | null;
  createdAt: string;
};

export type InviteTeacherResponse = {
  userId: string;
  email: string;
  newAccount: boolean;
  devResetToken: string | null;
};

export type TenantMemberSummary = {
  userId: string;
  email: string;
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  roles: string[];
};

export type GuardianLinkSummary = {
  id: string;
  studentId: string;
  studentEmail: string;
  status: "PENDING_CONSENT" | "CONFIRMED" | "REVOKED";
  requestedAt: string;
  consentGivenAt: string | null;
};
