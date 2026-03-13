/**
 * Chat API (port 8081): symptom chat sessions and messages.
 * See docs/postman/LifeLink-API.postman_collection.json
 */

import { apiConfig } from './config';

const base = apiConfig.chat;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Chat API ${res.status}: ${text || res.statusText}`);
  }
  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) return res.json() as Promise<T>;
  return undefined as T;
}

export interface ChatSession {
  id: string;
  [key: string]: unknown;
}

export function createChatSession(): Promise<ChatSession> {
  return request<ChatSession>('/api/chat/sessions', { method: 'POST' });
}

export function getChatSession(sessionId: string): Promise<ChatSession & { messages?: unknown[] }> {
  return request(`/api/chat/sessions/${encodeURIComponent(sessionId)}`);
}

export interface SendMessageResponse {
  reply?: string;
  message?: string;
  summary?: string;
  [key: string]: unknown;
}

export function sendChatMessage(
  sessionId: string,
  text: string
): Promise<SendMessageResponse> {
  return request<SendMessageResponse>(
    `/api/chat/sessions/${encodeURIComponent(sessionId)}/messages`,
    {
      method: 'POST',
      body: JSON.stringify({ text }),
    }
  );
}
