import apiClient from './apiClient';
import { clearToken, getToken, setToken } from '../auth/storage';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../interfaces/auth';
import type { UserData } from '../interfaces/user';

export type { AuthResponse, LoginPayload, RegisterPayload } from '../interfaces/auth';
export type { UserData } from '../interfaces/user';

// Obtain the data of the authenticated user through the JWT Token
// it sends request to the backend to validate the stored token in localStorage
export const getUser = async(): Promise<UserData | null> => {
    const token = getToken();

    // cancel the operation if the token was not valid
    if(!token) return null;

    try{
        const response = await apiClient.get<UserData>('/auth/me');
        return response.data;
    } catch(err) {
        console.error("The user can't be found", err);
        // clean localStorage in case the token failed or it's expired
        clearToken();
        return null;
    }
};

// login with your credentials 
// save the JWT token send from the backend into the localStorage
export const login = async(credentials: LoginPayload): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

        // if we receive the unique token, we store it
        if(response.data && response.data.token){
            setToken(response.data.token);
        }
        return response.data;
    } catch (err){
        console.error("Error while login with user", err);
        throw err;
    }
}

export const register = async(userData: RegisterPayload): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>('/auth/register', userData);

        if(response.data && response.data.token){
            setToken(response.data.token);
        }
        return response.data;
    }catch(err){
        console.error("Error while registering the user", err);
        throw err;
    }
}

// close the session
export const logout = (): void => {
    clearToken();
};

