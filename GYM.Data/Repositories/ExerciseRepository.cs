using GYM.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GYM.Data.Repositories;

public class ExerciseRepository : IExerciseRepository
{
    //Repo layer
    private readonly IDbContextFactory<GymDbContext> _factory;
    public ExerciseRepository(IDbContextFactory<GymDbContext> factory)
    {
        _factory = factory;
    }

    public async Task<IReadOnlyList<Exercise>> GetAllExercisesAsync()
    {
        await using var db = await _factory.CreateDbContextAsync();

        return await db.Exercises.ToListAsync(); //Return all exercises on db
    }

    public async Task<Exercise?> GetExerciseByName(string name)
    {
        await using var db = await _factory.CreateDbContextAsync();
        return await db.Exercises.FirstOrDefaultAsync(i => i.Name == name);
    }

    public async Task<Exercise> CreateExercise(Exercise exercise)
    {
        await using var db = await _factory.CreateDbContextAsync();

        await db.Exercises.AddAsync(exercise);
        await db.SaveChangesAsync();

        return exercise;
    }
}