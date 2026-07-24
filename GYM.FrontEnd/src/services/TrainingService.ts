import { api } from "../api/client";
import type { TrainingDTO } from "../types/trainingDTO";


// Petición GET limpia y sin tokens requeridos
export const getPublicTrainings = async (): Promise<TrainingDTO[]> => {
  try {
    const response = await api.get<TrainingDTO[]>('/Training/trainings');
    return response.data;
  } catch (error) {
    console.error('Error al obtener entrenamientos:', error);
    return [];
  }
};