export type Gender = 'Male' | 'Female' | 'Other';

export interface UserDetailData {
    gender: Gender,
    name: string,
    surname: string,
    joinAt: string,
    age: number
}