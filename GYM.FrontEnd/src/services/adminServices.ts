import { api } from "../api/client";
import type { exerciseDTO } from "../types/exerciseDTO";

// ==========================================
// USERS SERVICES
// ==========================================
/*
export const UserService = {
    // GET: Obtener todos los usuarios
    getAllUsers: async (): Promise<any[]> => {
        const response = await fetch(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Error fetching users');
        return await response.json();
    },

    // PUT: Actualizar rol o datos de un usuario
    updateUserRole: async (userId: number, role: string) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
        });
        if (!response.ok) throw new Error('Error updating user role');
        return await response.json();
    },

    // DELETE: Eliminar un usuario
    deleteUser: async (userId: number) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Error deleting user');
        return await response.json();
    },
};
*/

// ==========================================
// EXERCISES SERVICES (Catálogo Global)
// ==========================================

export const ExerciseService = {
    // GET: Obtener librería de ejercicios
    getAllExercises: async (): Promise<exerciseDTO[]> => {
        try {
            const response = await api.get<exerciseDTO[]>('/Training/exercises');
            return response.data;
        } catch (error) {
            console.error('Error getting exercises:', error);
            return Promise.reject(error);
        }
    },

    // POST: Crear nuevo ejercicio
    createExercise: async (exerciseData: exerciseDTO): Promise<exerciseDTO> => {
        try {
            const { id, ...dataToSend } = exerciseData;

            const response = await api.post<exerciseDTO>('/Training/exercises', dataToSend);
            return response.data;
        } catch (error) {
            console.error('Error creating exercise:', error);
            return Promise.reject(error);
        }
    },

    // PUT: Editar ejercicio
    updateExercise: async (exerciseData: exerciseDTO): Promise<exerciseDTO> => {
        try {
            const response = await api.put<exerciseDTO>(`/Training/exercises`, exerciseData);
            return response.data;
        } catch (error) {
            console.error('Error updating exercise:', error);
            return Promise.reject(error);
        }
    },

    // DELETE: Borrar ejercicio de la BD global
    deleteExercise: async (id: number) => {
        try {
            const response = await api.delete(`/Training/exercises/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting exercise:', error);
            return Promise.reject(error);
        }
    },
};

// ==========================================
// TRAININGS SERVICES (Rutinas y Tabla Pivote)
// ==========================================
/*
export const TrainingService = {
    // GET: Obtener todas las rutinas (con sus ejercicios vinculados)
    getAllTrainings: async () => {
        const response = await fetch(`${API_BASE_URL}/trainings`, {
        headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Error fetching trainings');
        return await response.json();
    },

    // POST: Crear rutina (incluyendo el array de IDs de ejercicios para la tabla pivote TrainingExercises)
    createTraining: async (trainingData: any) => {
        const response = await fetch(`${API_BASE_URL}/trainings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(trainingData),
        });
        if (!response.ok) throw new Error('Error creating training');
        return await response.json();
    },

    // PUT: Actualizar rutina
    updateTraining: async (id: number, trainingData: any) => {
        const response = await fetch(`${API_BASE_URL}/trainings/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(trainingData),
        });
        if (!response.ok) throw new Error('Error updating training');
        return await response.json();
    },

    // DELETE: Borrar rutina (sin eliminar los ejercicios de la BD global)
    deleteTraining: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/trainings/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Error deleting training');
        return await response.json();
    },
};
*/