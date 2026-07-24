import { apiCall } from "../api/client";
import type { RegisterUserDTOs } from "../types/RegisterUserDTOs";

// POST /auth/login { username, password }. The API answers with { token };
// bad credentials come back 401 and Axios throws - we can print a message to the user
// in the UI when that happens. 
export async function registerUser( email: string, password: string, phone: string): Promise<RegisterUserDTOs> {
    const response = await apiCall.post<RegisterUserDTOs>("/authentication/register", { email, password, phone });
    return response.data;
}