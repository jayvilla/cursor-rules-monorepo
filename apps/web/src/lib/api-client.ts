/**
 * API client utilities for authentication and API calls
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Get CSRF token from the API
 * This should be called before any POST/PUT/DELETE requests
 */
export async function getCsrfToken(): Promise<string> {
  const response = await fetch(`${API_URL}/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch CSRF token');
  }

  const data = await response.json();
  return data.token;
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<{ user: any }> {
  // First, get CSRF token
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
}

/**
 * Get current user (verify authentication)
 * Client-side version - uses cookies automatically via credentials: 'include'
 */
export async function getMe(): Promise<{ user: any } | null> {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    return null;
  }
}

/**
 * Get current user (server-side version)
 * For use in Server Components - passes cookies from the request
 */
export async function getMeServer(cookieHeader?: string): Promise<{ user: any } | null> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Pass cookies from the request if provided
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers,
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    return null;
  }
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  const csrfToken = await getCsrfToken();

  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken,
    },
    credentials: 'include',
  });
}

