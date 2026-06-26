// =============================================================================
// Admin API Helper — Token management & authenticated fetch
// =============================================================================

const LOGGED_IN_KEY = 'kspm_logged_in';

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------
export function isLoggedIn(): boolean {
  return localStorage.getItem(LOGGED_IN_KEY) === 'true';
}

// ---------------------------------------------------------------------------
// Authenticated fetch wrapper
// ---------------------------------------------------------------------------
export async function adminFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem(LOGGED_IN_KEY);
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
export async function login(userId: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Login failed');
  }

  const data = await res.json();
  localStorage.setItem(LOGGED_IN_KEY, 'true');
  return data;
}

export async function verifyToken(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/verify', { credentials: 'same-origin' });
    if (!res.ok) {
      localStorage.removeItem(LOGGED_IN_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function logout(): Promise<void> {
  localStorage.removeItem(LOGGED_IN_KEY);
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Content CRUD shortcuts
// ---------------------------------------------------------------------------
export function getContent<T = any>(section: string) {
  return adminFetch<T>(`/api/content/${section}`);
}

// ---------------------------------------------------------------------------
// Content Save
// ---------------------------------------------------------------------------
export function saveContent<T = any>(section: string, data: T) {
  return adminFetch(`/api/content/${section}`, {
    method: 'PUT',
    body: JSON.stringify({ content: data }),
  });
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
export function getMessages() {
  return adminFetch<any[]>('/api/messages');
}

export function markMessageRead(id: string) {
  return adminFetch(`/api/messages/${id}`, { method: 'PUT' });
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
    cloud_name: string;
    api_key: string;
    folder: string;
    allowed_formats?: string;
  }>('/api/upload/signature');

  // 2) Upload directly to Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', sigData.signature);
  formData.append('timestamp', String(sigData.timestamp));
  formData.append('api_key', sigData.api_key);
  formData.append('folder', sigData.folder);
  if (sigData.allowed_formats) {
    formData.append('allowed_formats', sigData.allowed_formats);
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sigData.cloud_name}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) throw new Error('Upload to Cloudinary failed');

  const result = await res.json();
  return result.secure_url as string;
}
