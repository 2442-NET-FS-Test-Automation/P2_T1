using GYM.Controller.Api.DTOs;

namespace GYM.Controller.Api.Services;

public interface IExerciseService
{
    Task<IReadOnlyList<ExerciseDTO>> GetAll();
}