import { type StatsDTO } from "./StatsDTO";

export interface UserReportDTO {
  userId: number;
  generatedAt: string;
  totalMeasurementsTaken: number;
  averageWeight: number;
  weightChange: number;
  bestMileRun: string;
  history: StatsDTO[];
  Top5BestMileRun: StatsDTO[];
  Top5Strength: StatsDTO[];
}