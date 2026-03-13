/**
 * Auth API: send OTP, verify OTP, optional me.
 * Uses LifeLink base URL. Dummy OTP 123456 accepted when API is unavailable (6-digit to match backend).
 */

import { apiConfig } from './config';

const base = apiConfig.lifelink;
const DUMMY_OTP = '123456';
const BD_COUNTRY_CODE = '+880';

/** Normalize BD mobile to E.164: +8801XXXXXXXXX */
export function normalizeBDPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) return BD_COUNTRY_CODE + digits.slice(1);
  if (digits.length === 10 && digits.startsWith('1')) return BD_COUNTRY_CODE + digits;
  if (digits.length === 12 && digits.startsWith('880')) return '+' + digits;
  return '';
}

export function isValidBDPhoneInput(input: string): boolean {
  const digits = input.replace(/\D/g, '');
  return (digits.length === 11 && digits.startsWith('01')) || (digits.length === 10 && digits.startsWith('1')) || (digits.length === 12 && digits.startsWith('880'));
}

export interface AuthUser {
  id: string;
  phone?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

/** User profile from GET /api/users/me (users table). */
export interface UserProfile extends AuthUser {
  gender?: string;
  date_of_birth?: string;
  state?: string;
  country_id?: number;
  blood_group?: string;
  emergency_contact_number?: string;
}

/** Minimal shape for self patient from verify; full type in lifelink.ts */
export interface SelfPatient {
  id: number;
  name?: string;
  is_self?: boolean;
  [key: string]: unknown;
}

export interface VerifyOtpResponse {
  token: string;
  user: AuthUser;
  self_patient?: SelfPatient | null;
  is_new_user?: boolean;
}

/** Backend wraps responses as { code, message, data }. Return data or full JSON. */
function unwrapData<T>(raw: unknown): T | undefined {
  if (raw && typeof raw === 'object' && 'data' in (raw as object))
    return (raw as { data: T }).data;
  return undefined;
}

async function request<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string>; token?: string | null }
): Promise<T> {
  const { params, token, ...init } = options ?? {};
  const url = new URL(path.startsWith('http') ? path : `${base}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') url.searchParams.set(k, v);
    });
  }
  const urlStr = url.toString();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token && token.trim()) {
    headers['Authorization'] = `Bearer ${token.trim()}`;
  }
  if (import.meta.env.DEV) {
    console.log('[Auth API]', init.method ?? 'GET', urlStr, token ? '(with JWT)' : '(no JWT)');
  }
  const res = await fetch(urlStr, {
    ...init,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Auth API ${res.status}: ${text || res.statusText}`);
  }
  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) return res.json() as Promise<T>;
  return undefined as T;
}

/** Request OTP for phone (E.164) or email. Backend may not exist yet. */
export async function sendOtp(phoneOrEmail: string, isEmail: boolean): Promise<void> {
  try {
    const path = '/api/auth/otp/request';
    if (isEmail) {
      const raw = await request<{ data?: unknown }>(path, {
        method: 'POST',
        body: JSON.stringify({ email: phoneOrEmail }),
      });
      unwrapData(raw); // may be undefined; we only care about 2xx
    } else {
      const raw = await request<{ data?: unknown }>(path, {
        method: 'POST',
        body: JSON.stringify({ phone: phoneOrEmail }),
      });
      unwrapData(raw);
    }
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[Auth] sendOtp failed (using dummy OTP flow):', e);
    }
    throw e;
  }
}

/**
 * Verify OTP. Returns token (JWT) + user + self_patient (null = complete profile step).
 * Backend returns { code, message, data } with data: { token, user, self_patient } (same as Postman).
 * The token is the JWT to send as Authorization: Bearer <token> on all other /api calls.
 * If backend fails, accepts dummy OTP "123456" and returns a local token/user; self_patient is null.
 */
export async function verifyOtp(
  phoneOrEmail: string,
  isEmail: boolean,
  otp: string
): Promise<VerifyOtpResponse> {
  const payload = isEmail
    ? { email: phoneOrEmail, otp }
    : { phone: phoneOrEmail, otp };

  try {
    const raw = await request<{ data?: VerifyOtpResponse }>('/api/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const data = unwrapData<VerifyOtpResponse & { access_token?: string; jwt?: string }>(raw) ?? (raw as Record<string, unknown>);
    const d = data as Record<string, unknown> | undefined;
    const token = d && (typeof d.token === 'string' ? d.token : typeof d.access_token === 'string' ? d.access_token : typeof d.jwt === 'string' ? d.jwt : null);
    const user = d && d.user;
    if (token && user && typeof user === 'object') {
      return {
        token,
        user: user as AuthUser,
        self_patient: (d.self_patient as SelfPatient | null | undefined) ?? null,
        is_new_user: d.is_new_user as boolean | undefined,
      };
    }
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[Auth] verifyOtp failed:', e);
    }
    const msg = e instanceof Error ? e.message : String(e);
    if (/Auth API (400|401|403)/.test(msg)) {
      throw e;
    }
  }

  // Dummy flow only when server unreachable (e.g. network): accept OTP 123456 for local demo
  if (otp.trim() !== DUMMY_OTP) {
    throw new Error('Invalid OTP. Please check the code and try again.');
  }

  const userId = 'user-' + (isEmail ? btoa(phoneOrEmail).slice(0, 12) : phoneOrEmail.replace(/\D/g, '').slice(-10));
  const user: AuthUser = {
    id: userId,
    name: undefined,
    ...(isEmail ? { email: phoneOrEmail } : { phone: phoneOrEmail }),
  };
  const token = 'dummy_' + userId + '_' + Date.now();
  return {
    token,
    user,
    self_patient: null,
    is_new_user: true,
  };
}

/** Optional: validate token and get current user. */
export async function getMe(token: string): Promise<AuthUser | null> {
  try {
    const raw = await request<{ data?: AuthUser | { user: AuthUser } }>('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = unwrapData<AuthUser | { user: AuthUser }>(raw) ?? raw;
    if (data && typeof data === 'object') {
      const u = data && 'user' in data ? (data as { user: AuthUser }).user : (data as AuthUser);
      if (u?.id) return u;
    }
  } catch {
    // ignore
  }
  return null;
}

/** Payload for update user (PUT /api/users/:id). Matches backend: name, gender, date_of_birth, address. */
export interface UpdateProfileBody {
  name: string;
  gender: string;
  date_of_birth?: string;
  address?: string;
  state?: string;
  country_id?: number;
  blood_group?: string;
  emergency_contact_number?: string;
  [key: string]: unknown;
}

/** GET /api/users/me — fetch current user. Uses stored JWT. */
export async function getProfile(): Promise<UserProfile> {
  const token = getStoredToken();
  if (!token || !token.trim()) throw new Error('Not logged in');
  const raw = await request<{ data?: UserProfile }>('/api/users/me', {
    token,
    headers: { Authorization: `Bearer ${token.trim()}` },
  });
  const data = unwrapData<UserProfile>(raw) ?? (raw as UserProfile);
  if (data && typeof data === 'object' && 'id' in data) return data as UserProfile;
  throw new Error('Invalid profile response');
}

/** PUT /api/users/me — update current user. Body: name, gender, date_of_birth, address. */
export async function updateProfile(body: UpdateProfileBody): Promise<UserProfile> {
  const token = getStoredToken();
  if (!token || !token.trim()) throw new Error('Not logged in');
  const raw = await request<{ data?: UserProfile }>('/api/users/me', {
    method: 'PUT',
    token,
    headers: { Authorization: `Bearer ${token.trim()}` },
    body: JSON.stringify(body),
  });
  const data = unwrapData<UserProfile>(raw) ?? (raw as UserProfile);
  if (data && typeof data === 'object' && 'id' in data) return data as UserProfile;
  throw new Error('Invalid profile response');
}

/** Storage keys for persistent auth */
export const AUTH_TOKEN_KEY = 'lifelink_token';
export const AUTH_USER_KEY = 'lifelink_user';
export const AUTH_SELF_PATIENT_KEY = 'lifelink_self_patient';
export const AUTH_ONBOARDING_DONE_KEY = 'lifelink_onboarding_done';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser(): AuthUser | null {
  try {
    const s = localStorage.getItem(AUTH_USER_KEY);
    return s ? (JSON.parse(s) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setAuthStorage(token: string, user: AuthUser, selfPatient?: SelfPatient | null): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  if (selfPatient != null) {
    localStorage.setItem(AUTH_SELF_PATIENT_KEY, JSON.stringify(selfPatient));
  } else {
    localStorage.removeItem(AUTH_SELF_PATIENT_KEY);
  }
  localStorage.setItem('lifelink_authenticated', 'true');
}

export function getStoredSelfPatient(): SelfPatient | null {
  try {
    const s = localStorage.getItem(AUTH_SELF_PATIENT_KEY);
    return s ? (JSON.parse(s) as SelfPatient) : null;
  } catch {
    return null;
  }
}

export function setStoredSelfPatient(selfPatient: SelfPatient | null): void {
  if (selfPatient != null) {
    localStorage.setItem(AUTH_SELF_PATIENT_KEY, JSON.stringify(selfPatient));
  } else {
    localStorage.removeItem(AUTH_SELF_PATIENT_KEY);
  }
}

export function clearAuthStorage(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_SELF_PATIENT_KEY);
  localStorage.removeItem(AUTH_ONBOARDING_DONE_KEY);
  localStorage.removeItem('lifelink_authenticated');
}

export function isOnboardingDone(): boolean {
  return localStorage.getItem(AUTH_ONBOARDING_DONE_KEY) === 'true';
}

export function setOnboardingDone(): void {
  localStorage.setItem(AUTH_ONBOARDING_DONE_KEY, 'true');
}
