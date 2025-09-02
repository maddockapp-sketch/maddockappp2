
import type { User } from '../types';

function getAuthHeaders() {
  const storedUser = localStorage.getItem('maddock-user');
  if (!storedUser) return {};
  
  try {
    const user: User = JSON.parse(storedUser);
    return {
      'Content-Type': 'application/json',
      'x-user-id': user.id,
      'x-user-role': user.role,
    };
  } catch (e) {
    return {};
  }
}

async function handleResponse<T,>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  get: async <T,>(endpoint: string): Promise<T> => {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<T>(response);
  },
  post: async <T,>(endpoint: string, body: any): Promise<T> => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },
  patch: async <T,>(endpoint: string, body: any): Promise<T> => {
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },
};
