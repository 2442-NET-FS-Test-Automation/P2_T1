import { api } from "../api/client";
import type { ExerciseDTO } from "../types/exerciseDTO";
import type { TrainingDTO, TrainingCreateDTO } from "../types/trainingDTO";
import type { UserAdminDTO, UserCreateAdminDTO, UserUpdateRoleDTO } from "../types/user";

// ==========================================
// USERS SERVICES
// ==========================================

export const UserService = {
    // Obtener todos los usuarios
    getAllUsers: async (): Promise<UserAdminDTO[]> => {
        try {
            const response = await api.get<UserAdminDTO[]>('/User/all-users');
            return response.data;
        } catch (error) {
            console.error('Error getting users:', error);
            return Promise.reject(error);            
        }
    },

    // Crear nuevo Staff (Admin o Trainer)
    createStaffUser: async (data: UserCreateAdminDTO): Promise<void> => {
        try {
            const response = await api.post('/User/create-staff', data);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            return Promise.reject(error);            
        }
    },

    // Cambiar rol de un usuario (PATCH enviando DTO)
    updateUserRole: async (userId: number, data: UserUpdateRoleDTO): Promise<void> => {
        try {
            const response = await api.patch(`/User/${userId}/role`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating user role:', error);
            return Promise.reject(error);            
        }
    }
};


// ==========================================
// EXERCISES SERVICES (Catálogo Global)
// ==========================================

export const ExerciseService = {
    // GET: Obtener librería de ejercicios
    getAllExercises: async (): Promise<ExerciseDTO[]> => {
        try {
            const response = await api.get<ExerciseDTO[]>('/Training/exercises');
            return response.data;
        } catch (error) {
            console.error('Error getting exercises:', error);
            return Promise.reject(error);
        }
    },

    // POST: Crear nuevo ejercicio
    createExercise: async (exerciseData: ExerciseDTO): Promise<ExerciseDTO> => {
        try {
            const { id, ...dataToSend } = exerciseData;

            const response = await api.post<ExerciseDTO>('/Training/exercises', dataToSend);
            return response.data;
        } catch (error) {
            console.error('Error creating exercise:', error);
            return Promise.reject(error);
        }
    },

    // PUT: Editar ejercicio
    updateExercise: async (exerciseData: ExerciseDTO): Promise<ExerciseDTO> => {
        try {
            const response = await api.put<ExerciseDTO>(`/Training/exercises`, exerciseData);
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

export const TrainingService = {
    // GET: Obtener todas las rutinas con sus ejercicios vinculados
    getAllTrainings: async (): Promise<TrainingDTO[]> => {
        try {
            const response = await api.get<TrainingDTO[]>('/Training/trainings');
            return response.data;
        } catch (error) {
            console.error('Error getting trainings:', error);
            return Promise.reject(error);
        }
    },

    // POST: Crear nueva rutina con sus ejercicios vinculados
    createTraining: async (trainingData: TrainingCreateDTO): Promise<TrainingCreateDTO> => {
        try {
            const response = await api.post<TrainingCreateDTO>('/Training/trainings', trainingData);
            return response.data;
        } catch (error) {
            console.error('Error creating training:', error);
            return Promise.reject(error);
        }
    },

    // PUT: Editar rutina existente
    updateTraining: async (trainingData: TrainingDTO): Promise<TrainingDTO> => {
        try {
            const response = await api.put<TrainingDTO>(`/Training/trainings-info`, trainingData);
            return response.data;
        } catch (error) {
            console.error('Error updating training:', error);
            return Promise.reject(error);
        }
    },

    // DELETE: Borrar rutina de la base de datos
    deleteTraining: async (trainingID: number): Promise<void> => {
        try {
            const response = await api.delete(`/Training/training/${trainingID}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting training:', error);
            return Promise.reject(error);
        }
    },
};