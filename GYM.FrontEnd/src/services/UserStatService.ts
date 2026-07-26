import { apiCall } from "../api/client"
import type { StatsDTO } from "../types/StatsDTO"

// get all stats
export const GetAllStats = async (): Promise<StatsDTO[]> => {
    try {
        const response = await apiCall.get('/api/Stats');
        return response.data;
    } catch(error) {
        console.error('Error getting stats');
        return [];
    }
} 

// get stats by id
export const GetStatsById = async(id: number): Promise<StatsDTO[]> => {
    try {
        const response = await apiCall.get(`/api/Stats/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting stats by id');
        return [];
    }
}

// get stats by user id
export const GetStatsByUserId = async(userId: number): Promise<StatsDTO[]> => {
    try {
        const response = await apiCall.get(`/api/Stats/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting stats by id');
        return [];
    }
}

// POST STATS
export const AddStats = async (): Promise<StatsDTO[]> => {
    try {
        const response = await apiCall.post('/api/Stats');
        return response.data;
    } catch(error) {
        console.error('Error getting stats');
        return [];
    }
} 

// PUT STATS
export const UpdateStats = async (): Promise<StatsDTO[]> => {
    try {
        const response = await apiCall.put('/api/Stats');
        return response.data;
    } catch(error) {
        console.error('Error getting stats');
        return [];
    }
} 

// delete stats
export const DeleteStatsById = async (id: number): Promise<StatsDTO[]> => {
    try {
        const response = await apiCall.delete(`/api/Stats/${id}`);
        return response.data;
    } catch(error) {
        console.error('Error getting stats');
        return [];
    }
} 