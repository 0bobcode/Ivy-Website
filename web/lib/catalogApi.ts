const BASE_URL = process.env.CATALOG_API_URL ?? "http://localhost:8082";

export class CatalogApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
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
    throw new CatalogApiError(res.status, body?.detail ?? "Something went wrong.", body?.code);
  }
  return body as T;
}

export type CourseSummary = {
  id: string;
  title: string;
  description: string;
  gradeLabel: string;
  provider: string;
  status: "DRAFT" | "PUBLISHED";
  lessonCount: number;
  createdAt: string;
  imageUrl: string | null;
  seatsLeft: number | null;
  features: string[];
};

export type LessonSummary = {
  id: string;
  title: string;
  contentType: "TEXT" | "VIDEO" | "FILE";
  textContent: string | null;
  mediaUrl: string | null;
  sortOrder: number;
};

export type CourseDetail = {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  gradeLabel: string;
  provider: string;
  status: "DRAFT" | "PUBLISHED";
  lessons: LessonSummary[];
  createdAt: string;
  imageUrl: string | null;
  seatsLeft: number | null;
  features: string[];
};

export const catalogApi = {
  browse: (params?: { grade?: string; provider?: string }) => {
    const qs = new URLSearchParams();
    if (params?.grade) qs.set("grade", params.grade);
    if (params?.provider) qs.set("provider", params.provider);
    const suffix = qs.toString() ? `?${qs}` : "";
    return request<CourseSummary[]>(`/api/v1/courses${suffix}`);
  },

  view: (id: string, accessToken?: string) =>
    request<CourseDetail>(`/api/v1/courses/${id}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    }),

  mine: (accessToken: string) =>
    request<CourseSummary[]>("/api/v1/courses/mine", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  all: (accessToken: string) =>
    request<CourseSummary[]>("/api/v1/courses/all", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  create: (
    accessToken: string,
    body: {
      title: string;
      description?: string;
      gradeLabel?: string;
      provider?: string;
      imageUrl?: string;
      seatsLeft?: number;
      features?: string[];
    },
  ) =>
    request<CourseDetail>("/api/v1/courses", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    }),

  publish: (accessToken: string, id: string) =>
    request<CourseDetail>(`/api/v1/courses/${id}/publish`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  unpublish: (accessToken: string, id: string) =>
    request<CourseDetail>(`/api/v1/courses/${id}/unpublish`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  addTextLesson: (accessToken: string, courseId: string, title: string, textContent: string) =>
    request<LessonSummary>(`/api/v1/courses/${courseId}/lessons`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ title, contentType: "TEXT", textContent }),
    }),

  // STU-04
  enroll: (accessToken: string, courseId: string) =>
    request<{ courseId: string; enrolledAt: string }>(`/api/v1/courses/${courseId}/enroll`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  myEnrollments: (accessToken: string) =>
    request<CourseSummary[]>("/api/v1/courses/enrolled/mine", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  // TCH-03
  roster: (accessToken: string, courseId: string) =>
    request<RosterEntry[]>(`/api/v1/courses/${courseId}/roster`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};

export type RosterEntry = {
  studentId: string;
  email: string | null;
  enrolledAt: string;
};
