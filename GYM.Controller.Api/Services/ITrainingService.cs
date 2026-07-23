using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;

namespace GYM.Controller.Api.Services;

public interface ITrainingService
{
    Task<IReadOnlyList<ExerciseDTO>> GetAllExercises();
    Task<ExerciseDTO?> GetExerciseById(int Id);
    Task<ExerciseDTO> AddExerciseAsync(ExerciseDTO exerciseDTO);
    Task<bool> DeleteExerciseByIdAsync(int ExerciseId);
    Task<TrainingDTO?> GetTrainingDTOAsync(int id);
    Task<IReadOnlyList<TrainingDTO>> GetAllTrainings();
    Task<TrainingDTO> AddTrainingAsync(TrainingAddDTO trainingDTO);
    Task<TrainingDTO?> AddExercisesToTraining(int trainingId, List<int> Exercises);
    Task<bool> DeleteExercisesFromTraining(int trainingId, List<int> Exercises);
    Task<ExerciseDTO?> UpdateExercise(ExerciseDTO exerciseDTO);
}