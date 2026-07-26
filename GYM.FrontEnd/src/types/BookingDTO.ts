import type { TrainingDTO } from "./trainingDTO";
import type { UserData } from "./user";

export type BookingStatus = 'Booked'|'Working' | 'Completed'| 'Cancelled'

export interface BookingDTO {
  id?: number;                  
  trainingId: number;       
  userId: number;    
  status: BookingStatus;       
  exerciseTime: string;       
  doneAt?: string;          
  trainings: TrainingDTO[];    
  users: UserData[];
}
