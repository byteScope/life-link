/**
 * Call (A/V) API (port 8082): token for video/audio calls by booking_id.
 * See docs/postman/LifeLink-API.postman_collection.json
 */

import { apiConfig } from './config';

const base = apiConfig.call;

export interface CallTokenResponse {
  token?: string;
  room_id?: string;
  [key: string]: unknown;
}

export async function getCallToken(bookingId: string): Promise<CallTokenResponse> {
  const res = await fetch(`${base}/api/call/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ booking_id: bookingId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Call API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}
