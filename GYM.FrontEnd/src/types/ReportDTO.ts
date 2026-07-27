import { type StatsDTO } from "./StatsDTO";

export interface ReportDTO {
  userId: number;
  generatedAt: string;
  totalMeasurementsTaken: number;
  averageWeight: number;
  weightChange: number;
  bestMileRun: string;
  history: StatsDTO[];
}