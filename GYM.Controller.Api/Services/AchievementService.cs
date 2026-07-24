using Azure.Core.Pipeline;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using GYM.Data.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GYM.Controller.Api.Services;

public class AchievementService : IAchievementService
{
    private readonly IAchievementRepository _repo;


    public AchievementService(IAchievementRepository repo)
    {
        _repo = repo;
    }
    public async Task<IReadOnlyList<AchievementDTO>> GetAllAchievements()
    {
        var achievements = await _repo.GetAllAchievementsAsync();

        if (achievements is null) return Array.Empty<AchievementDTO>(); // Avoid returning null for list types

        return achievements
            .Select(e => new AchievementDTO
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                Icon = e.Icon,
                Points = e.Points,
                Condition_type = e.Condition_type,
                ConditionValue = e.ConditionValue,
                UserAchievements = e.UserAchievements
            })
            .ToList()
            .AsReadOnly(); // Matches IReadOnlyList return type
    }

    public async Task<AchievementDTO?> GetAchievementById(int Id)
    {
        var achievement = await _repo.GetAchievementById(Id);

        if (achievement is null)
            return null;

        return new AchievementDTO
        {
            Id = achievement.Id,
            Name = achievement.Name,
            Description = achievement.Description,
            Icon = achievement.Icon,
            Points = achievement.Points,
            Condition_type = achievement.Condition_type,
            ConditionValue = achievement.ConditionValue,
            UserAchievements = achievement.UserAchievements
        };
    }

    public async Task<IEnumerable<AchievementDTO>> GetAchievementsByUserId(int userId)
    {
        var achievements = await _repo.GetAchievementsByUserId(userId);

        return achievements.Select(e => new AchievementDTO
        {
            Id = e.Id,
            Name = e.Name,
            Description = e.Description,
            Icon = e.Icon,
            Points = e.Points,
            Condition_type = e.Condition_type,
            ConditionValue = e.ConditionValue,
            UserAchievements = e.UserAchievements
        }).ToList();
    }

    public async Task<AchievementDTO> AddAchievementAsync(AchievementDTO achievementDTO)
    {
        Achievement newAchievement = new Achievement
        {
            Name = achievementDTO.Name,
            Description = achievementDTO.Description,
            Icon = achievementDTO.Icon,
            Points = achievementDTO.Points,
            Condition_type = achievementDTO.Condition_type,
            ConditionValue = achievementDTO.ConditionValue
        };

        Achievement dbAchievement = await _repo.AddAchievement(newAchievement);

        return new AchievementDTO
        {
            Id = dbAchievement.Id,
            Name = dbAchievement.Name,
            Description = dbAchievement.Description,
            Icon = dbAchievement.Icon,
            Points = dbAchievement.Points,
            Condition_type = dbAchievement.Condition_type,
            ConditionValue = dbAchievement.ConditionValue,
            UserAchievements = dbAchievement.UserAchievements
        };
    }

    public async Task<AchievementDTO?> UpdateAchievement(AchievementDTO achievementDTO)
    {
        Achievement? ex = await _repo.GetAchievementById(achievementDTO.Id);

        if (ex is null)
            return null;

        ex.Name = achievementDTO.Name;
        ex.Description = achievementDTO.Description;
        ex.Icon = achievementDTO.Icon;
        ex.Points = achievementDTO.Points;
        ex.Condition_type = achievementDTO.Condition_type;
        ex.ConditionValue = achievementDTO.ConditionValue;

        Achievement updatedEx = await _repo.UpdateAchievement(ex);

        return new AchievementDTO
        {
            Id = updatedEx.Id,
            Name = updatedEx.Name,
            Description = updatedEx.Description,
            Icon = updatedEx.Icon,
            Points = updatedEx.Points,
            Condition_type = updatedEx.Condition_type,
            ConditionValue = updatedEx.ConditionValue,
            UserAchievements = updatedEx.UserAchievements
        };
    }

    public Task<bool> DeleteAchievementByIdAsync(int AchievementId)
    {
        return _repo.RemoveAchievement(AchievementId);
    }

}