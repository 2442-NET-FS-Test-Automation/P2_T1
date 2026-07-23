using GYM.Data.Entities;

namespace GYM.Data.Repositories;

public interface IExerciseRepository
{
    Task<IReadOnlyList<Exercise>> GetAllExercisesAsync();
    Task<Exercise?> GetExerciseByName(string name);
    Task<Exercise> CreateExercise(Exercise exercise);
}