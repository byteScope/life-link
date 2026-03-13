/**
 * API base URLs. Set via .env (see .env.example).
 * Fallback to localhost defaults when not set.
 */
const getEnv = (key: string, fallback: string): string =>
  (import.meta.env[key] as string | undefined) || fallback;

export const apiConfig = {
  lifelink: getEnv('VITE_API_LIFELINK', 'http://localhost:8080'),
  chat: getEnv('VITE_API_CHAT', 'http://localhost:8081'),
  call: getEnv('VITE_API_CALL', 'http://localhost:8082'),
};
