import type { UserData } from './user';

export interface AuthResponse {
  token: string;
  user?: UserData;
}

export interface LogInDTO {
  email: string;
  password: string;
}

