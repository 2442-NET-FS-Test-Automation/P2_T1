import { clearToken, getToken, setToken } from '../auth/storage';
import type { AuthResponse, LogInDTO } from '../types/LogInDTO';
import type { RegisterUserDTOs } from '../types/RegisterUserDTOs';
import type { UserData } from '../types/user';
import { api as apiClient} from '../api/client';



// Obtain the data of the authenticated user through the JWT Token
// it sends request to the backend to validate the stored token in localStorage
export const getUser = async(): Promise<UserData | null> => {
    const token = getToken();

    // cancel the operation if the token was not valid
    if(!token) return null;

    try{
        const response = await apiClient.get<UserData>('/authentication/me');
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
export const login = async(credentials: LogInDTO): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>('/authentication/login', credentials);

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

export const register = async(userData: RegisterUserDTOs): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>('/authentication/register', userData);

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

