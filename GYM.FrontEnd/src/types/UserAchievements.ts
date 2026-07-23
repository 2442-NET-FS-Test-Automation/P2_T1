// El logro tal como existe en la base de datos (Catálogo)
export interface AchievementItem {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
  conditionType: string;  
  conditionValue: number;
}

export interface UserAchievement {
  id: number;
  achievementId: number;
  userId: number;
  completedAt: string;     // DateTime de C# llega como ISO string en JSON
  achievement: AchievementItem; // Propiedad de navegación
}

// data to create a new achievement in trainer's screen
export type CreateAchievementBody = Omit<AchievementItem, "id">; // Omit inherits all fields except for 'id'