using GYM.Data.Entities;

namespace GYM.Data.Repositories;

public interface ITrainingRepository
{
    Task<IReadOnlyList<Exercise>> GetAllExercisesAsync();
    Task<Exercise?> GetExerciseById(int Id);
    Task<Exercise> AddExercise(Exercise exercise);
    Task<bool> RemoveExercise(int n);
    Task<Training?> GetTrainingById(int id);
    Task<IReadOnlyList<Training>> GetAllTrainingsAsync();
    Task<Training> AddTraining(Training training);
    Task<Training> AddExercisesToTraining(Training training, List<Exercise> Exercises);
    Task<bool> DeleteExercisesFromTraining(Training training, List<Exercise> Exercises);
    Task<Exercise> UpdateExercise(Exercise UpdatedExercise);
}