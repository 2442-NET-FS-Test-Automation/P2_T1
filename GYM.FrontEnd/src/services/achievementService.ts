import { apiCall as apiClient } from "../api/client";

export interface Achievement {
  id: number;
  name: string;
  description: string;
  completedAt: string | null;
}


export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const url = "/api/Achievement/allAchievements";
    const response = await apiClient.get<Achievement[]>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    throw error;
  }
};


export const getUserAchievement = async (): Promise<Achievement[]> => {
  try {
    const url = `/api/Achievement/AchievementByUserId`;
    const response = await apiClient.get<Achievement[]>(url);


    if (response.status === 204) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    throw error;
  }
};
