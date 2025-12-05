import type { AstroGlobal } from 'astro';

export interface AdminSession {
  isAuthenticated: boolean;
  username?: string;
}

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = 'admin123'; // In production, use proper hashing

export function checkAuth(request: Request): AdminSession {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return { isAuthenticated: false };
  }

  const cookies = parseCookies(cookieHeader);
  const authToken = cookies['admin-auth'];

  if (!authToken) {
    return { isAuthenticated: false };
  }

  // Simple token validation (in production, use JWT or similar)
  try {
    const decoded = atob(authToken);
    const [username, password] = decoded.split(':');

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD_HASH) {
      return { isAuthenticated: true, username };
    }
  } catch (e) {
    return { isAuthenticated: false };
  }

  return { isAuthenticated: false };
}

export function createAuthToken(username: string, password: string): string {
  return btoa(`${username}:${password}`);
}

export function createAuthCookie(token: string): string {
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  return `admin-auth=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict`;
}

export function createLogoutCookie(): string {
  return 'admin-auth=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict';
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });
  return cookies;
}

export function requireAuth(Astro: AstroGlobal): boolean {
  const session = checkAuth(Astro.request);
  if (!session.isAuthenticated) {
    return false;
  }
  return true;
}
