import { api, apiCall } from "../api/client";
import type { CreateUserDetailDTO, Gender, AuthMeResponse, Statistic } from '../types/user';

const mapGenderToEnum = (gender?: string | number | Gender): number => {
    if (gender === undefined || gender === null) return 0; // Valor por defecto si no seleccionó nada

    if (typeof gender === 'number') {
        return gender;
    }

    switch (gender.toLowerCase()) {
        case 'male':
            return 0;
        case 'female':
            return 1;
        case 'other':
            return 2;
        default:
            return 0;
    }
};

export async function setUserDetails(userDetail: CreateUserDetailDTO): Promise<CreateUserDetailDTO> {
    const meResponse = await apiCall.get<AuthMeResponse>("/authentication/me");
    const currentUserId = meResponse.data.id;

    const payload: CreateUserDetailDTO = {
        userId: currentUserId,
        gender: mapGenderToEnum(userDetail.gender),
        name: userDetail.name,
        surname: userDetail.surname,
        joinAt: userDetail.joinAt || new Date().toISOString(),
        age: userDetail.age
    };

    const response = await api.post<CreateUserDetailDTO>("/User/users-details", payload);
    return response.data;
}

export async function setUserStats(statsData: Partial<Statistic>): Promise<Statistic> {
  const meResponse = await api.get<AuthMeResponse>("/authentication/me");
  const currentUserId = meResponse.data.id;

  const payload = {
    userId: currentUserId,
    height: statsData.height ?? 0,
    weight: statsData.weight ?? 0,
    strength: statsData.strength ?? 0,
    mileRun: statsData.mileRun || "00:00",
    measureAt: statsData.measureAt || new Date().toISOString(),
  };

  const response = await api.post<Statistic>("/User/users-stats", payload);
  return response.data;
}

