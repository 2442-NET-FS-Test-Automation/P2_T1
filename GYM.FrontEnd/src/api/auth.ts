import { login as loginUser } from "../services/auth";

// POST /auth/login { username, password }. The API answers with { token };
// bad credentials come back 401 and Axios throws - we can print a message to the user
// in the UI when that happens.

export async function login (email: string, password: string): Promise<string> {
    const response = await loginUser({ email, password });
    return response.token;
}