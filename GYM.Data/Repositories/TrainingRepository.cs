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

    public async Task<Exercise> AddExercise(Exercise exercise)
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
        return await db.Trainings
            .Include(t => t.TrainingExercises)//include bridge table that is as a navigation property of traininig
            .ThenInclude(te => te.Exercise) //Include the actual exercise
            .FirstOrDefaultAsync(i => i.Id == id); //First or default traininig with id ==
    }

    public async Task<IReadOnlyList<Training>> GetAllTrainingsAsync()
    {
        await using var db = await _factory.CreateDbContextAsync();

        IReadOnlyList<Training> trainings = db.Trainings
            .Include(i => i.TrainingExercises)
            .ThenInclude(x => x.Exercise).ToList();
        
        return trainings;
    }

    public async Task<Training> AddTraining(Training training)
    {
        await using var db = await _factory.CreateDbContextAsync();
        await db.Trainings.AddAsync(training);
        await db.SaveChangesAsync();
        return training;

    }

    public async Task<Training> AddExercisesToTraining(Training training, List<Exercise> exercises)
    {
        await using var db = await _factory.CreateDbContextAsync();
        foreach(Exercise ex in exercises)
        { 
           
            await db.TrainingExercises.AddAsync(new TrainingExercises
                {
                    TrainingId = training.Id,
                    ExerciseId = ex.Id
                });
        }
        await db.SaveChangesAsync();

        Training? Updatedtraining = await db.Trainings
            .Include(t => t.TrainingExercises)//include bridge table that is as a navigation property of traininig
            .ThenInclude(te => te.Exercise) //Include the actual exercise
            .FirstOrDefaultAsync(i => i.Id == training.Id); //First or default traininig with id ==

        return Updatedtraining;
    }

    public async Task<bool> DeleteExercisesFromTraining(Training training, List<Exercise> Exercises)
    {
        await using var db = await _factory.CreateDbContextAsync();
        foreach(Exercise ex in Exercises)
        {
            TrainingExercises? te = await db.TrainingExercises.
                FirstOrDefaultAsync(i => i.ExerciseId == ex.Id && i.TrainingId == training.Id);
            if(te is not null)
                db.TrainingExercises.Remove(te);
        }
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<Exercise> UpdateExercise(Exercise UpdatedExercise)
    {
        await using var db = await _factory.CreateDbContextAsync();
        db.Exercises.Update(UpdatedExercise);
        await db.SaveChangesAsync();
        return UpdatedExercise;
    }

    public async Task<Training> UpdateTrainingInfo(Training UpdatedTraining)
    {
        await using var db = await _factory.CreateDbContextAsync();
        db.Trainings.Update(UpdatedTraining);
        await db.SaveChangesAsync();
        return UpdatedTraining;
    }

    public async Task<bool> DeleteTraining(Training training)
    {
        await using var db = await _factory.CreateDbContextAsync();

        db.Trainings.Remove(training);
        await db.SaveChangesAsync();
        return true;
    }
}