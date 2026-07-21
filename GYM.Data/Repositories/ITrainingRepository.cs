using GYM.Data.Entities;

namespace GYM.Data.Repositories;

public interface ITrainingRepository
{
    Task<IReadOnlyList<Exercise>> GetAllExercisesAsync();
    Task<Exercise?> GetExerciseById(int Id);
    Task<Exercise> CreateExercise(Exercise exercise);
    Task<bool> RemoveExercise(int n);

    Task<Training?> GetTrainingById(int id);
}