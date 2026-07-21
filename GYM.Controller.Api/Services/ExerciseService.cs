using GYM.Controller.Api.DTOs;
using GYM.Data.Repositories;

namespace GYM.Controller.Api.Services;

//Repo Layer
public class ExerciseService : IExerciseService
{ 
    private readonly IExerciseRepository _repository;

    public ExerciseService(IExerciseRepository repository)
    {
        _repository = repository;
    }
    public async Task<IReadOnlyList<ExerciseDTO>> GetAll()
    {

        var exercises= await _repository.GetAllAsync();
        
        if(exercises is null)
            return null;
        
        return exercises
            .Select(e => new ExerciseDTO
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                VisualReferenceUrl = e.VisualReferenceUrl,
                Sets = e.Sets,
                Reps = e.Reps
            })
            .ToList();
        
    }
}