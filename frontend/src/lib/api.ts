/**
 * Centralized Typed API Client
 * Connects frontend Next.js application to the backend API service.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Core HTTP Request Wrapper
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; meta?: Record<string, any> }> {
  // 1. Retrieve stored JWT token if executing in browser
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const payload: ApiResponse<T> = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message || 'API request failed');
  }

  return { data: payload.data, meta: payload.meta };
}

// ============================================================================
// Specialized API Endpoints
// ============================================================================

export const authApi = {
  login: (input: { email: string; password: string }) =>
    apiClient<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  register: (input: { email: string; password: string; displayName: string; role?: string }) =>
    apiClient<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  getMe: () => apiClient<any>('/auth/me'),
};

export const skillsApi = {
  list: (params?: { search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const qs = searchParams.toString();
    return apiClient<any[]>(`/skills${qs ? `?${qs}` : ''}`);
  },

  getBySlug: (slug: string) => apiClient<any>(`/skills/${slug}`),

  getSecurityReport: (slug: string, version: string) =>
    apiClient<any>(`/skills/${slug}/versions/${version}/security`),

  create: (data: any) =>
    apiClient<any>('/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  publishVersion: (slug: string, data: any) =>
    apiClient<any>(`/skills/${slug}/versions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const discoveryApi = {
  discover: (prompt: string) =>
    apiClient<any>('/discovery', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),
};

export const compositionApi = {
  compose: (data: {
    name: string;
    description: string;
    sourceSkillVersionIds: string[];
    customInstructions?: string;
  }) =>
    apiClient<any>('/composition/compose', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  generate: (data: { name: string; prompt: string }) =>
    apiClient<any>('/composition/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const communityApi = {
  submitReview: (slug: string, data: { rating: number; comment?: string }) =>
    apiClient<any>(`/community/skills/${slug}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  vote: (slug: string, voteValue: number) =>
    apiClient<any>(`/community/skills/${slug}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteValue }),
    }),

  getMyCollections: () => apiClient<any[]>('/community/collections/me'),

  createCollection: (data: { name: string; description?: string; visibility?: string }) =>
    apiClient<any>('/community/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  addSkillToCollection: (collectionId: string, skillId: string) =>
    apiClient<any>(`/community/collections/${collectionId}/skills`, {
      method: 'POST',
      body: JSON.stringify({ skillId }),
    }),
};

