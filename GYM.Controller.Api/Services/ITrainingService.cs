using GYM.Controller.Api.DTOs;

namespace GYM.Controller.Api.Services;

public interface ITrainingService
{
    Task<IReadOnlyList<ExerciseDTO>> GetAllExercises();
    Task<ExerciseDTO?> GetExerciseById(int Id);
    Task<ExerciseDTO> AddExerciseAsync(ExerciseDTO exerciseDTO);
    Task<bool> DeleteExerciseByIdAsync(int ExerciseId);
    Task<TrainingDTO> GetTrainingDTOAsync(int id);
    Task<TrainingDTO> AddTrainingAsync(TrainingDTO training);
}