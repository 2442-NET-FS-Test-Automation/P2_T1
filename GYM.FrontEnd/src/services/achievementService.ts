import apiClient from './apiClient'; // Tu cliente de Axios configurado

// Representa la estructura de un logro tal como viene de la base de datos
export interface Achievement {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
  completed_at: string | null;
}

/**
 * Obtiene la lista de logros con el estado del usuario actual.
 * El backend se encarga de calcular si están desbloqueados según el userId.
 */
export const achievementsWithStatus = async (userId: number | null): Promise<Achievement[]> => {
  try {
    // Si no hay usuario, mandamos una petición limpia para traer solo los logros base
    const url = userId ? `/achievements?userId=${userId}` : '/achievements';
    const response = await apiClient.get<Achievement[]>(url);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
};