import { apiCall } from "../api/client";
import type { StatsDTO } from "../types/StatsDTO";

// GET: api/stats
export const getPublicStats = async (): Promise<StatsDTO[]> => {
    try {
        const response = await apiCall.get<StatsDTO[]>('/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching all stats rows:', error);
        return [];
    }
};

// GET: api/stats/{id}
export const getStatsById = async (id: number): Promise<StatsDTO | null> => {
    try {
        const response = await apiCall.get<StatsDTO>(`/api/Stats/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching stats entry ID ${id}:`, error);
        return null;
    }
};

// GET: api/stats/user/{userId}
export const getStatsByUserId = async (userId: number): Promise<StatsDTO[]> => {
    try {
        const response = await apiCall.get<StatsDTO[]>(`/api/Stats/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching stats logs for user ID ${userId}:`, error);
        return [];
    }
};

// POST: api/stats
export const addStatsAsync = async (newStats: Omit<StatsDTO, 'id'>): Promise<StatsDTO | null> => {
    try {
        const response = await apiCall.post<StatsDTO>('/api/Stats', newStats);
        return response.data;
    } catch (error) {
        console.error('Error adding new biometric metric log entry:', error);
        return null;
    }
};

// PUT: api/stats
export const updateStatsAsync = async (updatedStats: StatsDTO): Promise<StatsDTO | null> => {
    try {
        const response = await apiCall.put<StatsDTO>('/api/Stats', updatedStats);
        return response.data;
    } catch (error) {
        console.error(`Error updating tracking metrics row ID ${updatedStats.id}:`, error);
        return null;
    }
};

// DELETE: api/stats/{id}
export const deleteStatsByIdAsync = async (id: number): Promise<boolean> => {
    try {
        // Your controller returns NoContent (244 status codes) upon success
        await apiCall.delete(`/api/Stats/${id}`);
        return true;
    } catch (error) {
        console.error(`Failed to execute deletion route for record ID ${id}:`, error);
        return false;
    }
};
