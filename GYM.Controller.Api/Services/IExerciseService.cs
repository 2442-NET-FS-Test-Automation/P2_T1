using GYM.Controller.Api.DTOs;

namespace GYM.Controller.Api.Services;

public interface IExerciseService
{
    Task<IReadOnlyList<ExerciseDTO>> GetAllExercises();
    Task<ExerciseDTO?> GetExerciseByName(string name);
    Task<ExerciseDTO> AddExerciseAsync(ExerciseDTO exerciseDTO);
}