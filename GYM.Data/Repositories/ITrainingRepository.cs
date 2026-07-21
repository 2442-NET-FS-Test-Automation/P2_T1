using GYM.Data.Entities;

namespace GYM.Data.Repositories;

public interface ITrainingRepository
{
    public Task<IReadOnlyList<Training>> GetAllAsync();
    public Task<Training?> GetByIdAsync(int id);
    public  Task AddAsync(Training Training);

    public Task UpdateAsync(Training Training);
    public  Task DeleteAsync(Training Training);

    public Task<bool> ExistsAsync(int id);
    public Task SaveChangesAsync();
}