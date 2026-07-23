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