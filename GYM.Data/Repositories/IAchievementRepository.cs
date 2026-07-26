using GYM.Data.Entities;

namespace GYM.Data.Repositories;

public interface IAchievementRepository
{
    Task<IReadOnlyList<Achievement>> GetAllAchievementsAsync();
    Task<Achievement?> GetAchievementById(int Id);
    Task<IEnumerable<Achievement>> GetAchievementsByUserId(int userid);
    Task<Achievement> AddAchievement(Achievement exercise);
    Task<bool> RemoveAchievement(int n);

    Task<Achievement> UpdateAchievement(Achievement UpdatedAchievement);

    Task<bool> ExistsAsync(int id);
}