// services/userDetails.ts
import { api } from "../api/client"; // Ajusta el import si tu client se llama distinto
import type { UserDetailData } from "../types/user";

// GET: api/User/users-details — returns the logged-in user's details (single object, not an array)
export const getUserDetails = async (): Promise<UserDetailData | null> => {
    try {
        const response = await api.get<UserDetailData>('/User/users-details');
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};

// PUT: api/User/users-details — userId is set server-side from the auth token
export const updateUserDetails = async (
    body: UserDetailData
): Promise<UserDetailData | null> => {
    try {
        const response = await api.put<UserDetailData>('/User/users-details', body);
        return response.data;
    } catch (error) {
        console.error('Error updating user details:', error);
        return null;
    }
};