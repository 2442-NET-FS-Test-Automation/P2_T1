import type { UserData } from './user';

export interface AuthResponse {
  token: string;
  user?: UserData;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone?: string;
}