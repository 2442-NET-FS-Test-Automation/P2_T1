using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;

namespace GYM.Controller.Api.Services;



public interface IAchievementService
{
    Task<IReadOnlyList<AchievementDTO>> GetAllAchievements();
    Task<AchievementDTO?> GetAchievementById(int Id);
    Task<IEnumerable<AchievementDTO>> GetAchievementsByUserId(int userId);
    Task<AchievementDTO> AddAchievementAsync(AchievementDTO exerciseDTO);
    Task<AchievementDTO?> UpdateAchievement(AchievementDTO bookingDTO);
    Task<bool> DeleteAchievementByIdAsync(int AchievementId);
    
    // Task<TrainingDTO?> GetTrainingDTOAsync(int id);
    // Task<IReadOnlyList<TrainingDTO>> GetAllTrainings();
    // Task<TrainingDTO?> AddTrainingsToAchievement(int trainingId, List<int> Achievements);
    // Task<bool> DeleteTrainingsFromAchievement(int trainingId, List<int> Achievements);

}