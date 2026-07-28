export type Gender = 'Male' | 'Female' | 'Other';

export interface UserDetailData {
  gender?: Gender;
  name: string;
  surname: string;
  joinAt?: string;
  age?: number;
}

export interface Statistic {
  weight: number;
  height: number;
  strength: number;
  mileRun: string;
  measureAt: string;
}

export interface UserData {
  id: number;
  email: string;
  phone: string | number;
  role?: string;
  detail?: UserDetailData;
  stadistic?: Statistic;
}

export interface CreateUserDetailDTO {
    id?: number;
    userId?: number;
    gender?: Gender | number;
    name: string;
    surname: string;
    joinAt?: string;
    age?: number;
}

export interface StatsDTO {
    userId: number;
    weight: number;
    height: number;
    strength: number;
    mileRun: string;
    measureAt: string;
    age: number;
}

export interface UserAdminDTO {
    id: number;
    email: string;
    phone: string;
    role: string; // 'User' | 'Trainer' | 'Admin'
    name: string;
    surname: string;
    joinAt?: string | null;
}

export interface UserCreateAdminDTO {
    email: string;
    phone: string;
    password: string;
    role: 'Admin' | 'Trainer';
    name: string;
    surname: string;
}

export interface UserUpdateRoleDTO {
    newRole: string; // O 'User' | 'Trainer' | 'Admin'
}

export interface AuthMeResponse {
    id: number;
    name: string;
    role: string;
}
