/**
 * LifeLink main API (port 8080): doctors, bookings, services, emergency, blood, patients, appointments.
 * See docs/postman/LifeLink-API.postman_collection.json
 */

import { apiConfig } from './config';
import { getStoredToken } from './auth';

const base = apiConfig.lifelink;

/** All /api routes (except /api/auth/*) require JWT. We send it when present. */
async function request<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const { params, ...init } = options ?? {};
  const url = new URL(path.startsWith('http') ? path : `${base}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') url.searchParams.set(k, v);
    });
  }
  const urlStr = url.toString();
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (import.meta.env.DEV) {
    console.log('[LifeLink API]', init.method ?? 'GET', urlStr);
  }
  const res = await fetch(urlStr, {
    ...init,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) return res.json() as Promise<T>;
  return undefined as T;
}

/** Request with Bearer token (for patients/me, appointments, etc.). Throws if no token. */
async function requestWithAuth<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const token = getStoredToken();
  if (!token) throw new Error('Not logged in');
  return request<T>(path, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

/** Parse backend response shape { code, message, data }. Returns data or undefined. */
function unwrapData<T>(raw: unknown): T | undefined {
  if (raw && typeof raw === 'object' && 'data' in raw) return (raw as { data: T }).data;
  return undefined;
}

// --- Doctors ---
export interface Doctor {
  id: string;
  name?: string;
  specialty?: string;
  area?: string;
  rating?: number;
  reviews?: number;
  [key: string]: unknown;
}

/** Accept raw array or object with data | doctors | data.doctors | items | results */
function extractDoctorList(raw: unknown): Doctor[] {
  if (Array.isArray(raw)) return raw as Doctor[];
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.doctors)) return o.doctors as Doctor[];
    if (Array.isArray(o.data)) return o.data as Doctor[];
    if (o.data && typeof o.data === 'object' && Array.isArray((o.data as Record<string, unknown>).doctors))
      return (o.data as { doctors: Doctor[] }).doctors;
    if (Array.isArray(o.items)) return o.items as Doctor[];
    if (Array.isArray(o.results)) return o.results as Doctor[];
  }
  return [];
}

export function listDoctors(params?: { specialty?: string; area?: string }): Promise<Doctor[]> {
  return request<unknown>(`/api/doctors`, {
    params: params as Record<string, string>,
  }).then(extractDoctorList);
}

export function getDoctorSlots(doctorId: string): Promise<{ slot?: string }[] | string[]> {
  return request(`/api/doctors/${encodeURIComponent(doctorId)}/slots`).then((data: unknown) => {
    if (Array.isArray(data)) return data as { slot?: string }[] | string[];
    return [];
  });
}

// --- Bookings ---
export interface CreateBookingBody {
  doctor_id?: string;
  provider_id?: string;
  slot: string;
  patient: string;
  phone: string;
  care_type?: string;
  duration?: string;
  location?: string;
}

export interface Booking {
  id: string;
  [key: string]: unknown;
}

export function createBooking(body: CreateBookingBody): Promise<Booking> {
  return request<Booking>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

function extractBookingList(raw: unknown): Booking[] {
  if (Array.isArray(raw)) return raw as Booking[];
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    for (const key of ['data', 'bookings', 'items', 'results']) {
      const val = key === 'data' && o.data && typeof o.data === 'object' ? (o.data as Record<string, unknown>).bookings : o[key];
      if (Array.isArray(val)) return val as Booking[];
    }
    if (o.data && typeof o.data === 'object' && Array.isArray((o.data as Record<string, unknown>).bookings))
      return (o.data as { bookings: Booking[] }).bookings;
  }
  return [];
}

export function listBookings(): Promise<Booking[]> {
  return request<unknown>('/api/bookings').then(extractBookingList);
}

export function getBooking(id: string): Promise<Booking> {
  return request<Booking>(`/api/bookings/${encodeURIComponent(id)}`);
}

// --- Patients (auth required for me & create) ---
export interface Patient {
  id: number;
  user_id?: number;
  /** Backend uses single name; legacy first/last for compatibility */
  name?: string;
  first_name?: string;
  last_name?: string;
  gender: string;
  date_of_birth?: string;
  phone_number?: string;
  email_address?: string;
  /** Backend uses single address */
  address?: string;
  address_line1?: string;
  address_line2?: string;
  state?: string;
  country_id?: number;
  is_self?: boolean;
  created_at?: string;
  [key: string]: unknown;
}

/** Display name from patient (backend name or first + last). */
export function patientDisplayName(p: Patient): string {
  if (p.name && String(p.name).trim()) return String(p.name).trim();
  const first = [p.first_name, p.last_name].filter(Boolean).join(' ').trim();
  if (first) return first;
  return 'Patient';
}

export interface CreatePatientBody {
  user_id?: number;
  /** Required for backend; use this or first_name+last_name (mapped to name when sending). */
  name?: string;
  first_name?: string;
  last_name?: string;
  gender: string;
  date_of_birth?: string;
  phone_number?: string;
  email_address?: string;
  /** Single address for backend */
  address?: string;
  address_line1?: string;
  address_line2?: string;
  state?: string;
  country_id?: number;
  /** true = self (logged-in user); false = family/other */
  is_self?: boolean;
}

/** GET /api/patients/me — returns patients linked to current user. Requires auth. selfOnly=true uses ?self=1. */
export function getPatientsMe(selfOnly?: boolean): Promise<Patient[]> {
  const path = selfOnly ? '/api/patients/me?self=1' : '/api/patients/me';
  return requestWithAuth<unknown>(path).then((raw) => {
    const data = unwrapData<{ patients?: Patient[] }>(raw);
    if (data && Array.isArray(data.patients)) return data.patients;
    if (Array.isArray(data)) return data as Patient[];
    return [];
  });
}

/** Build backend payload: name (required), gender, address (single), is_self, and optional fields. */
function buildCreatePatientPayload(body: CreatePatientBody): Record<string, unknown> {
  const name =
    body.name?.trim() ||
    [body.first_name, body.last_name].filter(Boolean).join(' ').trim();
  const address =
    body.address?.trim() ||
    [body.address_line1, body.address_line2, body.state].filter(Boolean).join(', ').trim() ||
    undefined;
  return {
    name: name || undefined,
    gender: body.gender,
    phone_number: body.phone_number?.trim() || undefined,
    email_address: body.email_address?.trim() || undefined,
    date_of_birth: body.date_of_birth?.trim() || undefined,
    country_id: body.country_id,
    address: address || undefined,
    is_self: body.is_self ?? false,
  };
}

/** POST /api/patients — create patient. Backend expects name, gender; optional address, is_self, etc. Auth: JWT sent by request(). */
export function createPatient(body: CreatePatientBody): Promise<Patient> {
  const payload = buildCreatePatientPayload(body);
  if (!payload.name) {
    return Promise.reject(new Error('Name is required'));
  }
  return request<unknown>('/api/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((raw) => {
    const data = unwrapData<Patient>(raw);
    if (data && typeof data === 'object' && 'id' in data) return data as Patient;
    return raw as Patient;
  });
}

// --- Appointments (auth recommended) ---
export interface CreateAppointmentBody {
  patient_id: number;
  doctor_id?: number;
  provider_id?: number;
  appointment_datetime: string; // RFC3339 or "YYYY-MM-DDTHH:mm:ss"
  reason: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id?: number;
  provider_id?: number;
  appointment_datetime: string;
  status_id?: number;
  reason?: string;
  created_at?: string;
  [key: string]: unknown;
}

/** POST /api/appointments — create appointment. Requires patient_id, doctor_id or provider_id. Auth: JWT sent by request(). */
export function createAppointment(body: CreateAppointmentBody): Promise<Appointment> {
  return request<unknown>('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(body),
  }).then((raw) => {
    const data = unwrapData<Appointment>(raw);
    if (data && typeof data === 'object' && 'id' in data) return data as Appointment;
    return raw as Appointment;
  });
}

// --- Services (providers) ---
export interface Service {
  id: string;
  title?: string;
  provider?: string;
  category?: string;
  [key: string]: unknown;
}

export function listServices(params?: {
  category?: string;
  care_type?: string;
  area?: string;
}): Promise<Service[]> {
  return request<Service[]>(`/api/services`, {
    params: params as Record<string, string>,
  }).then((arr) => (Array.isArray(arr) ? arr : []));
}

export function getService(id: string): Promise<Service> {
  return request<Service>(`/api/services/${encodeURIComponent(id)}`);
}

export function getServiceSlots(serviceId: string): Promise<{ slot?: string }[] | string[]> {
  return request(`/api/services/${encodeURIComponent(serviceId)}/slots`).then((data: unknown) => {
    if (Array.isArray(data)) return data as { slot?: string }[] | string[];
    return [];
  });
}

// --- Emergency ---
export interface CreateEmergencyBody {
  service_type: string;
  location: string;
  details?: string;
}

export interface Emergency {
  id: string;
  status?: string;
  [key: string]: unknown;
}

export function createEmergency(body: CreateEmergencyBody): Promise<Emergency> {
  return request<Emergency>('/api/emergency', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getEmergency(id: string): Promise<Emergency> {
  return request<Emergency>(`/api/emergency/${encodeURIComponent(id)}`);
}

// --- Blood ---
export interface CreateBloodRequestBody {
  blood_group: string;
  units: string;
  location: string;
  urgency: string;
}

export interface BloodRequest {
  id: string;
  [key: string]: unknown;
}

export interface BloodDonor {
  id?: string;
  name?: string;
  blood_group?: string;
  location?: string;
  [key: string]: unknown;
}

export function createBloodRequest(body: CreateBloodRequestBody): Promise<BloodRequest> {
  return request<BloodRequest>('/api/blood-requests', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getBloodRequest(id: string): Promise<BloodRequest> {
  return request<BloodRequest>(`/api/blood-requests/${encodeURIComponent(id)}`);
}

export function searchBloodDonors(params: {
  blood_group: string;
  location?: string;
}): Promise<BloodDonor[]> {
  return request<BloodDonor[]>(`/api/blood-requests/donors/search`, {
    params: params as Record<string, string>,
  }).then((arr) => (Array.isArray(arr) ? arr : []));
}
