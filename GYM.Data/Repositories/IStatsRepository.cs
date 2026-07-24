using GYM.Data.Entities;

namespace GYM.Data.Repositories;

public interface IStatsRepository
{
    Task<IReadOnlyList<Statistic>> GetAllStatsAsync();
    Task<Statistic?> GetStatsById(int id);
    Task<IEnumerable<Statistic>> GetStatsByUserId(int userid);
    Task<Statistic> AddStats(Statistic stats);
    Task<bool> RemoveStats(int n);

    Task<Statistic> UpdateStats(Statistic updatedStats);

    Task<bool> ExistsAsync(int id);
}