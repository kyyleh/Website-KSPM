// =============================================================================
// Admin API Helper — Token management & authenticated fetch
// =============================================================================

const TOKEN_KEY = 'kspm_admin_token';

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// ---------------------------------------------------------------------------
// Authenticated fetch wrapper
// ---------------------------------------------------------------------------
export async function adminFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearToken();
    window.location.hash = '#/admin/login';
    throw new Error('Unauthorized — session expired');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed: ${response.statusText}`);
  }

  // Some endpoints (DELETE 204) return no body
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

// ---------------------------------------------------------------------------
// Auth endpoints
// ---------------------------------------------------------------------------
export async function login(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Login failed');
  }

  const data = await res.json();
  setToken(data.token);
  return data;
}

export async function verifyToken(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function logout() {
  clearToken();
}

// ---------------------------------------------------------------------------
// Content CRUD shortcuts
// ---------------------------------------------------------------------------
export function getContent<T = any>(section: string) {
  return adminFetch<T>(`/api/content/${section}`);
}

export function saveContent<T = any>(section: string, data: T) {
  return adminFetch(`/api/content/${section}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
export function getMessages() {
  return adminFetch<any[]>('/api/messages');
}

export function markMessageRead(id: string) {
  return adminFetch(`/api/messages/${id}/read`, { method: 'PATCH' });
}

export function deleteMessage(id: string) {
  return adminFetch(`/api/messages/${id}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Cloudinary upload helper
// ---------------------------------------------------------------------------
export async function uploadToCloudinary(file: File): Promise<string> {
  // 1) Get signature from our backend
  const sigData = await adminFetch<{
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    folder: string;
  }>('/api/upload/signature');

  // 2) Upload directly to Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', sigData.signature);
  formData.append('timestamp', String(sigData.timestamp));
  formData.append('api_key', sigData.apiKey);
  formData.append('folder', sigData.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) throw new Error('Upload to Cloudinary failed');

  const result = await res.json();
  return result.secure_url as string;
}
