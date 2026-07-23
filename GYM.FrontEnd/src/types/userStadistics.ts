// Representa un registro individual de medición física/rendimiento
export interface StatisticItem {
  id: number;
  weight: number;
  height: number;
  strength: number;
  milerun: string;
  measureAt: string;
  age: number;
}

// create stadistics
export type CreateStatisticBody = Omit<StatisticItem, "id" | "measureAt">; // omitting id and measureAt