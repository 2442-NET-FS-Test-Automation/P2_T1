import type { UserData } from './user';

export interface AuthResponse {
  token: string;
  user?: UserData;
}

export interface LogInDTO {
  Email: string;
  Password: string;
}

