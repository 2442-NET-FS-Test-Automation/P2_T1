import type { exerciseDTO } from "./exerciseDTO";

export type Place = 'Home' | 'Gym' | 'Outdoor';

export interface TrainingDTO {
  id?: number;                  // int? -> opcional (number)
  trainingName: string;        // string -> string
  difficulty: string;          // string -> string
  place: Place | number;      // Place -> Enum o número
  calories: number;            // int -> number
  description: string;         // string -> string
  estimatedTime: string;       // TimeOnly -> string (ej. "01:30:00")
  createdAt?: string;          // DateTime? -> opcional string en formato ISO (ej. "2026-07-22T...")
  exercises: exerciseDTO[];    // List<ExerciseDTO> -> Array de ExerciseDTO
}
