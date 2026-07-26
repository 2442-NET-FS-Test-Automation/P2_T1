using GYM.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GYM.Data.Repositories;

public class StatsRepository : IStatsRepository
{


    private readonly IDbContextFactory<GymDbContext> _factory;


    public StatsRepository(IDbContextFactory<GymDbContext> factory)
    {
        _factory = factory;
    }


public async Task<IReadOnlyList<Statistic>> GetAllStatsAsync()
{
    await using var db = await _factory.CreateDbContextAsync();
    return await db.Statistics.ToListAsync(); 
}

public async Task<Statistic?> GetStatsById(int id)
{
    await using var db = await _factory.CreateDbContextAsync();
    return await db.Statistics.FirstOrDefaultAsync(i => i.Id == id);
}

public async Task<IEnumerable<Statistic>> GetStatsByUserId(int userid)
{
    await using var db = await _factory.CreateDbContextAsync();
    return await db.Statistics
        .Where(b => b.UserId == userid)
        .ToListAsync();
}

public async Task<Statistic> AddStats(Statistic stats) 
{
    await using var db = await _factory.CreateDbContextAsync();

    await db.Statistics.AddAsync(stats);
    await db.SaveChangesAsync(); 
    return stats; // EF Core automatically assigns the new database generated primary Id here
}

public async Task<bool> RemoveStats(int id)
{
    await using var db = await _factory.CreateDbContextAsync();

    // Use a stub object to avoid a costly initial SELECT database query
    var statsToRemove = new Statistic { Id = id };
    db.Statistics.Entry(statsToRemove).State = EntityState.Deleted;

    try
    {
        await db.SaveChangesAsync();
        return true;
    }
    catch (DbUpdateConcurrencyException)
    {
        return false; // Returns false cleanly if the record does not exist
    }
}

public async Task<Statistic> UpdateStats(Statistic updatedStats)
{
    await using var db = await _factory.CreateDbContextAsync();
    
    // Explicitly instruct EF to track this detached entity as modified
    db.Entry(updatedStats).State = EntityState.Modified;
    
    await db.SaveChangesAsync();
    return updatedStats;
}

public async Task<bool> ExistsAsync(int id)
{
    await using var db = await _factory.CreateDbContextAsync();
    return await db.Statistics.AnyAsync(m => m.Id == id);
}


}