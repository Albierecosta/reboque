import type { ServiceCategory, ServiceRequest, User } from "@/types";

const runtimeApiUrl =
  typeof window !== "undefined" ? window.__APP_CONFIG__?.VITE_API_URL : undefined;

const API_URL = runtimeApiUrl ?? import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";
const TOKEN_KEY = "altum_token";

type ApiIssue = {
  path?: Array<string | number>;
  message: string;
};

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;
  issues?: ApiIssue[];

  constructor(message: string, status: number, issues?: ApiIssue[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.issues = issues;
  }
}

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (!token) {
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}) {
  const token = getStoredToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const issues = Array.isArray(payload?.issues) ? (payload.issues as ApiIssue[]) : undefined;
    const details = issues
      ?.map((issue) => {
        const path = issue.path?.length ? `${issue.path.join(".")}: ` : "";
        return `${path}${issue.message}`;
      })
      .join(" ");
    const message = details
      ? `${payload?.message ?? "Nao foi possivel concluir a requisicao."} ${details}`
      : (payload?.message ?? "Nao foi possivel concluir a requisicao.");

    throw new ApiError(message, response.status, issues);
  }

  return payload as T;
}

export const api = {
  login(email: string, password: string) {
    return apiRequest<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password }),
    });
  },
  register(payload: unknown) {
    return apiRequest<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      auth: false,
      body: JSON.stringify(payload),
    });
  },
  me() {
    return apiRequest<User>("/auth/me");
  },
  categories() {
    return apiRequest<ServiceCategory[]>("/service-requests/categories", {
      auth: false,
    });
  },
  customerRequests() {
    return apiRequest<ServiceRequest[]>("/service-requests/mine");
  },
  createRequest(payload: unknown) {
    return apiRequest<{ request: ServiceRequest; matchedProviders: Array<{ distanceKm: number; businessName: string }> }>("/service-requests", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  requestById(id: string) {
    return apiRequest<ServiceRequest>(`/service-requests/${id}`);
  },
  cancelRequest(id: string) {
    return apiRequest<ServiceRequest>(`/service-requests/${id}/cancel`, {
      method: "PATCH",
    });
  },
  rateRequest(id: string, score: number, comment: string) {
    return apiRequest(`/service-requests/${id}/rate`, {
      method: "POST",
      body: JSON.stringify({ score, comment }),
    });
  },
  providerDashboard() {
    return apiRequest<{
      profile: ProviderProfileResponse;
      activeRequest?: ServiceRequest | null;
      availableRequests: ServiceRequest[];
      recentHistory: ServiceRequest[];
      notifications: Array<{ id: string; title: string; message: string; createdAt: string }>;
    }>("/provider/dashboard");
  },
  providerAvailableRequests() {
    return apiRequest<ServiceRequest[]>("/provider/service-requests/available");
  },
  providerAcceptRequest(id: string) {
    return apiRequest<ServiceRequest>(`/provider/service-requests/${id}/accept`, {
      method: "POST",
    });
  },
  providerUpdateStatus(id: string, status: string) {
    return apiRequest<ServiceRequest>(`/provider/service-requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  providerHistory() {
    return apiRequest<ServiceRequest[]>("/provider/history");
  },
  providerUpdateProfile(payload: unknown) {
    return apiRequest("/provider/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  providerAvailability(payload: unknown) {
    return apiRequest("/provider/availability", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  providerLocation(payload: unknown) {
    return apiRequest("/provider/location", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  adminDashboard() {
    return apiRequest<{
      metrics: {
        usersCount: number;
        providersApproved: number;
        providersPending: number;
        requestsByStatus: Record<string, number>;
      };
      latestRequests: ServiceRequest[];
    }>("/admin/dashboard");
  },
  adminUsers() {
    return apiRequest<User[]>("/admin/users");
  },
  adminProviders() {
    return apiRequest<Array<ProviderProfileResponse>>("/admin/providers");
  },
  adminRequests() {
    return apiRequest<ServiceRequest[]>("/admin/service-requests");
  },
  adminRegions() {
    return apiRequest<Array<{ city: string; state: string; providers: number }>>("/admin/regions");
  },
  adminCategories() {
    return apiRequest<ServiceCategory[]>("/admin/service-categories");
  },
  adminCreateCategory(payload: unknown) {
    return apiRequest("/admin/service-categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  adminUpdateCategory(id: string, payload: unknown) {
    return apiRequest(`/admin/service-categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  adminApproveProvider(userId: string, isApproved: boolean) {
    return apiRequest(`/admin/providers/${userId}/approval`, {
      method: "PATCH",
      body: JSON.stringify({ isApproved }),
    });
  },
};

type ProviderProfileResponse = User["providerProfile"] & {
  user?: User;
};
