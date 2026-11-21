const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'kazuki_token';

export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
}

function messageFor(status: number, data: unknown): string {
  const serverMessage =
    typeof data === 'object' && data !== null && 'message' in data
      ? String((data as { message: unknown }).message)
      : null;

  if (serverMessage) return serverMessage;
  if (status === 401) return 'Tu sesión no es válida. Inicia sesión de nuevo.';
  if (status === 403) return 'No tienes permisos para esta acción.';
  if (status === 429) return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
  return 'Ocurrió un error inesperado.';
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = tokenStorage.get();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor.', 0);
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    // Token vencido o inválido: se limpia la sesión y se avisa a la app
    if (response.status === 401 && auth && token) {
      tokenStorage.clear();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw new ApiError(messageFor(response.status, data), response.status, data);
  }

  return data as T;
}