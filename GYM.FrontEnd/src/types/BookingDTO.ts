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

export interface AdminBookingDTO {
    id?: string | number;
    trainingName: string;
    status: BookingStatus;
    doneAt: string; // ISO String o Formato Fecha
    email: string;
    name: string;
    surname?: string;
}


