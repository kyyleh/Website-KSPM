/**
 * API Client for KSPM Website Backend
 * Connects to Vercel Serverless Functions at /api/*
 * Falls back to config.ts defaults when backend data is unavailable
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Resolves media URLs. Cloudinary URLs are returned as-is.
 * Relative paths are prefixed with the API base URL.
 */
export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Cloudinary optimization: automatically serve WebP/AVIF and optimize quality
    if (url.includes('res.cloudinary.com') && !url.includes('f_auto')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
    return url;
  }
  if (url.startsWith('/')) {
    return url; // Local public assets
  }
  return `${API_BASE}${url}`;
}

/**
 * Fetch content for a specific section from the backend API.
 */
async function fetchContent<T>(section: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}/api/content/${section}`);
    if (!response.ok) return null;
    const json = await response.json();
    return json.content as T;
  } catch (error) {
    console.warn(`Failed to fetch ${section} from backend, using config fallback`, error);
    return null;
  }
}

/**
 * Submit contact form message to the backend API.
 */
export async function submitContactForm(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const response = await fetch(`${API_BASE}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit message to backend');
  }
  return await response.json();
}

/**
 * Mapped data fetchers — these return data in the format
 * expected by the frontend components, or null to use config fallback.
 */

export async function getMappedHero(): Promise<any | null> {
  return fetchContent('hero');
}

export async function getMappedAbout(): Promise<any | null> {
  const aboutData = await fetchContent<any>('about');
  if (!aboutData) return null;

  return {
    aboutConfig: aboutData.museum || aboutData.aboutConfig || aboutData,
    orgConfig: aboutData.organization || aboutData.orgConfig || undefined,
  };
}

export async function getMappedActivities(): Promise<any | null> {
  return fetchContent('events');
}

export async function getMappedResearch(): Promise<any | null> {
  return fetchContent('research');
}

export async function getMappedContact(): Promise<any | null> {
  return fetchContent('contact');
}
