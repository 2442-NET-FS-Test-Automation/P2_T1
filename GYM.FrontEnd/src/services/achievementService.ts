import { apiCall as apiClient} from '../api/client'; // O apiClient, según como tengas nombrada la instancia de Axios

export interface Achievement {
  id: number;
  name: string;
  description: string;
  completed_at: string | null;
}

/**
 * Obtiene la lista de logros con el estado del usuario actual.
 */
export const getAchievements = async (id: number | null): Promise<Achievement[]> => {
  try {
    // Apuntamos al endpoint correspondiente de ASP.NET Core
    const url = '/api/Achievement/allAchievements';

    const response = await apiClient.get<Achievement[]>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
};

export const getUserAchievement = async(id: number | null): Promise<Achievement[]> => {
  try {
    const url = `/api/Achievement/AchievementByUserId/${id}`;

    const response = await apiClient.get<Achievement[]>(url);
    return response.data;
  } catch (error){
    console.error('Error fetching user achievements:', error);
    throw error;
  }
}