import { api } from "./client";
import type { AchievementItem, UserAchievement, CreateAchievementBody } from "../types/UserAchievements";

// Here lives the catalog data call to the api

// get all achievements
export async function getAchievementx(): Promise<AchievementItem[]> {
    const response = await api.get<AchievementItem[]>("/api/achievements");
    return response.data;
}

// get userAchievements role: user only
export async function getUserAchievements(): Promise<UserAchievement> {
    const response = await api.get<UserAchievement>(`/api/user-achievements/me`);
    return response.data;
}

// Finaly - two calls that SHOULD be trainer-only
export async function createAchievement(body: CreateAchievementBody) : Promise<AchievementItem>{
    const response = await api.post<AchievementItem>("/api/achievements", body);
    return response.data;
}

// only trainer can delete an achievement
export async function deleteAchievent(id: number): Promise<void>{
    await api.delete(`/api/achievements/${id}`)
}