import { api } from "./client";
import type { StatisticItem, CreateStatisticBody } from "../interfaces/userStadistics";

// Get stats of actual user
export async function getUserStatistics(): Promise<StatisticItem[]> {
  const response = await api.get<StatisticItem[]>("/api/statistics/me");
  return response.data;
}

// create new stadistic
export async function createStatistic(body: CreateStatisticBody): Promise<StatisticItem> {
  const response = await api.post<StatisticItem>("/api/statistics", body);
  return response.data;
}