import apiClient from './apiClient';

export interface UserData{
    id: string,
    name: string,
    email: string,
    role?: string
}

export interface AuthResponse {
    token: string,
    user: UserData
}

export interface LoginPayload {
    email: string,
    password: string
}

export interface RegisterPayload {
    name: string,
    surname: string,
    email: string,
    password: string,
    phone?: string
}

// Obtain the data of the authenticated user through the JWT Token
// it sends request to the backend to validate the stored token in localStorage
export const GetUser = async(): Promise<UserData | null> => {
    const token = localStorage.getItem('gym_token');

    // cancel the operation if the token was not valid
    if(!token) return null;

    try{
        const response = await apiClient.get<UserData>('auth/me');
        return response.data;
    } catch(err) {
        console.error("The user can't be found", err);
        // clean localStorage in case the token failed or it's expired
        localStorage.removeItem('gym_token');
        return null;
    }
}

