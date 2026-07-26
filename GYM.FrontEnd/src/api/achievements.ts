import { api } from "./client";
import type { AchievementDTO, UserAchievement, CreateAchievementBody } from "../types/AchievementDTO";

// Here lives the catalog data call to the api

// get all achievements
export async function getAchievements(): Promise<AchievementDTO[]> {
    const response = await api.get<AchievementDTO[]>("/api/Achievement/allAchievements");
    return response.data;
}

export async function getAchievementById(id: number): Promise<UserAchievement> {
    const response = await api.get<UserAchievement>(`/api/Achievement/AchievementById/${id}`);
    return response.data;
}

export async function getUserAchievement(id: number): Promise<UserAchievement> {
    const response = await api.get<UserAchievement>(`/api/Achievement/AchievementByUserId/${id}`);
    return response.data;
}

// Finaly - two calls that SHOULD be trainer
export async function AddAchievement(body: CreateAchievementBody) : Promise<AchievementDTO>{
    const response = await api.post<AchievementDTO>("/api/Achievement/AddAchievement", body);
    return response.data;
}

export async function updateAchievement(achievement: AchievementDTO): Promise<AchievementDTO>{
    const response = await api.put<AchievementDTO>("/api/Achievement/updateAchievement", achievement);
    return response.data;
}

// only trainer can delete an achievement
export async function deleteAchievement(id: number): Promise<void>{
    await api.delete(`/api/Achievement/Achievement/${id}`)
}