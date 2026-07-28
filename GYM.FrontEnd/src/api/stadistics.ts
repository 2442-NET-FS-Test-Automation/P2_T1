import { api } from "./client";
import type { StatsDTO, CreateStatisticBody } from "../types/StatsDTO";

// Get stats of actual user
export async function getUserStatistics(): Promise<StatsDTO[]> {
  const response = await api.get<StatsDTO[]>("/stats/user");
  return response.data;
}

// create new stadistic
export async function createStatistic(body: CreateStatisticBody): Promise<StatsDTO> {
  const response = await api.post<StatsDTO>("/stats", body);
  return response.data;
}