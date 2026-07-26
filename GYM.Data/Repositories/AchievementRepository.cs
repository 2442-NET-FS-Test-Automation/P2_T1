using GYM.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GYM.Data.Repositories;

public class AchievementRepository : IAchievementRepository
{


    private readonly IDbContextFactory<GymDbContext> _factory;


    public AchievementRepository(IDbContextFactory<GymDbContext> factory)
    {
        _factory = factory;
    }


    public async Task<IReadOnlyList<Achievement>> GetAllAchievementsAsync()
    {
        await using var db = await _factory.CreateDbContextAsync();
        // Materializes the data before the DbContext context is disposed
        return await db.Achievements.ToListAsync();
    }

    public async Task<Achievement?> GetAchievementById(int id)
    {
        await using var db = await _factory.CreateDbContextAsync();
        return await db.Achievements.FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task<IEnumerable<Achievement>> GetAchievementsByUserId(int userid)
    {
        await using var db = await _factory.CreateDbContextAsync();

        // Querying through the UserAchievements join table link instead of a missing direct UserId
        return await db.Achievements
            .Where(a => a.UserAchievements.Any(ua => ua.UserId == userid))
            .ToListAsync();
    }

    public async Task<Achievement> AddAchievement(Achievement achievement)
    {
        await using var db = await _factory.CreateDbContextAsync();

        await db.Achievements.AddAsync(achievement);
        await db.SaveChangesAsync();
        return achievement; // The DbContext assigns the auto-generated ID here
    }

    public async Task<bool> RemoveAchievement(int id)
    {
        await using var db = await _factory.CreateDbContextAsync();

        // Using a simple stub entity saves an expensive initial SELECT read query
        var achievementToRemove = new Achievement { Id = id };

        db.Achievements.Entry(achievementToRemove).State = EntityState.Deleted;

        try
        {
            await db.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            return false; // Returns false safely if the record did not exist
        }
    }

    public async Task<Achievement> UpdateAchievement(Achievement updatedAchievement)
    {
        await using var db = await _factory.CreateDbContextAsync();

        // Explicitly forces EF to attach and track changes for a detached context entity
        db.Entry(updatedAchievement).State = EntityState.Modified;

        await db.SaveChangesAsync();
        return updatedAchievement;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        await using var db = await _factory.CreateDbContextAsync();
        return await db.Achievements.AnyAsync(m => m.Id == id);
    }


}