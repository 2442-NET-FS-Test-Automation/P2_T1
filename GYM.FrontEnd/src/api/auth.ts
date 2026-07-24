//import { login as loginUser } from "../services/auth";
import { apiCall } from "./client";

// POST /auth/login { username, password }. The API answers with { token };
// bad credentials come back 401 and Axios throws - we can print a message to the user
// in the UI when that happens.

/*export async function login (Email: string, Password: string): Promise<string> {
    const response = await loginUser({ Email, Password });
    return response.token;
}*/

export async function login( Email: string, Password: string): Promise<string> {
    const response = await apiCall.post<{token: string}>("authentication/login", { Email, Password });
    return response.data.token;
}