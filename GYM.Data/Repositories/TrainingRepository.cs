using GYM.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GYM.Data.Repositories;

public class TrainingRepository : ITrainingRepository
{
    //Repo layer
    private readonly IDbContextFactory<GymDbContext> _factory;
    public TrainingRepository(IDbContextFactory<GymDbContext> factory)
    {
        _factory = factory;
    }

    public async Task<IReadOnlyList<Exercise>> GetAllExercisesAsync()
    {
        await using var db = await _factory.CreateDbContextAsync();

        return await db.Exercises.ToListAsync(); //Return all exercises on db
    }

    public async Task<Exercise?> GetExerciseById(int Id)
    {
        await using var db = await _factory.CreateDbContextAsync();
        return await db.Exercises.FirstOrDefaultAsync(i => i.Id == Id);
    }

    public async Task<Exercise> CreateExercise(Exercise exercise)
    {
        await using var db = await _factory.CreateDbContextAsync();

        await db.Exercises.AddAsync(exercise);
        await db.SaveChangesAsync();

        return exercise;
    }

    //Remove exercise by id
    public async Task<bool> RemoveExercise(int n)
    {
        await using var db = await _factory.CreateDbContextAsync();

        Exercise? ExerciseRemoved = await db.Exercises.FirstOrDefaultAsync(i => i.Id == n);

        if(ExerciseRemoved is null)
            return false;
        
        db.Exercises.Remove(ExerciseRemoved);
        await db.SaveChangesAsync();
        return true;

    }

    public async Task<Training?> GetTrainingById(int id)
    {
        await using var db = await _factory.CreateDbContextAsync();
        return await db.Trainings.FirstOrDefaultAsync(i => i.Id == id);

    }
}