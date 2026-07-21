using GYM.Data;
using GYM.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GYM.Data.Repositories;

public class TrainingRepository : ITrainingRepository
{


    private readonly IDbContextFactory<GymDbContext> _factory;


    public TrainingRepository(IDbContextFactory<GymDbContext> factory)
    {
        _factory = factory;
    }


    public async Task<IReadOnlyList<Training>> GetAllAsync()
    {
        await using var db = await _factory.CreateDbContextAsync();

        return await db.Trainings
            .Include(m => m.Inventory)
            .ToListAsync();
    }

    public async Task<Training?> GetByIdAsync(int id)
    {
        await using var db = await _factory.CreateDbContextAsync();

        return await db.Trainings
            .Include(m => m.Inventory)
            .FirstOrDefaultAsync(m => m.TrainingID == id);
    }

    public async Task AddAsync(Training Training) 
    {
        await using var db = await _factory.CreateDbContextAsync();

        await db.Trainings.AddAsync(Training);
        await db.SaveChangesAsync(); 
    }

    public async Task UpdateAsync(Training Training)
    {
        await using var db = await _factory.CreateDbContextAsync();
        db.Entry(Training).State = EntityState.Modified;
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Training Training)
    {
        await using var db = await _factory.CreateDbContextAsync();
        db.Trainings.Remove(Training);
        await db.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(int id)
    {
        await using var db = await _factory.CreateDbContextAsync();
        return await db.Trainings.AnyAsync(m => m.TrainingID == id);
    }

    public async Task SaveChangesAsync()
    {

        await Task.CompletedTask;
    }

}