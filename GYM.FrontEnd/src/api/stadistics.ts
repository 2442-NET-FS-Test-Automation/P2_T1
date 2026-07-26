import { apiCall } from "./client";
import type { StatsDTO, CreateStatisticBody } from "../types/StatsDTO";

// Get stats of actual user
export async function getUserStatistics(): Promise<StatsDTO[]> {
  const response = await apiCall.get<StatsDTO[]>("/api/Stats");
  return response.data;
}

// create new stadistic
export async function createStatistic(body: CreateStatisticBody): Promise<StatsDTO> {
  const response = await apiCall.post<StatsDTO>("/api/Stats", body);
  return response.data;
}