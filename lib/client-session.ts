import { createSupabaseBrowserClient } from '@/lib/supabase';

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
};

const USER_STORAGE_KEY = 'user';
const REMEMBERED_EMAIL_KEY = 'remembered-email';
const APP_TOKEN_STORAGE_KEY = 'app-token';

export async function getStoredToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  const appToken = localStorage.getItem(APP_TOKEN_STORAGE_KEY);
  if (appToken) {
    return appToken;
  }

  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? null;
}

export function getStoredUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  const user = localStorage.getItem(USER_STORAGE_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as StoredUser;
  } catch {
    return null;
  }
}

export function setStoredSession(user: StoredUser) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(REMEMBERED_EMAIL_KEY, user.email);
}

export function setStoredAppToken(token: string) {
  localStorage.setItem(APP_TOKEN_STORAGE_KEY, token);
}

export async function clearStoredSession() {
  const supabase = createSupabaseBrowserClient();
  await supabase.auth.signOut();
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(APP_TOKEN_STORAGE_KEY);
}

export function getRememberedEmail() {
  if (typeof window === 'undefined') {
    return '';
  }

  return localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? '';
}

export async function syncStoredSessionFromSupabase() {
  const token = await getStoredToken();
  if (!token) {
    return null;
  }

  const res = await fetch('/api/auth/session', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  const user = data.user as StoredUser;
  setStoredSession(user);
  return user;
}

export async function resumeRememberedSession(email: string) {
  const rememberedEmail = getRememberedEmail().trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();

  if (!rememberedEmail || rememberedEmail !== normalizedEmail) {
    return null;
  }

  return syncStoredSessionFromSupabase();
}

export function getDashboardPath(user: StoredUser) {
  if (user.role === 'SELLER') {
    return '/seller/items';
  }

  if (user.role === 'ADMIN') {
    return '/admin';
  }

  return '/profile';
}
