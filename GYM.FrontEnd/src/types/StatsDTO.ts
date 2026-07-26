// Representa un registro individual de medición física/rendimiento
export interface StatsDTO {
  id: number;
  userId: number;
  weight: number;
  height: number;
  strength: number;
  mileRun: string;
  measureAt: string;
  age: number;
}

// create stadistics
export type CreateStatisticBody = Omit<StatsDTO, "id" | "measureAt">; // omitting id and measureAt