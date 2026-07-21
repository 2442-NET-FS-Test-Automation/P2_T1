

using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
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
    public async Task<IReadOnlyList<ExerciseDTO>> GetAllExercises()
    {

        var exercises= await _repository.GetAllExercisesAsync();
        
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

    public async Task<ExerciseDTO?> GetExerciseByName(string name)
    {
        var exercise = await _repository.GetExerciseByName(name);

        if(exercise is null)
            return null;

        ExerciseDTO exerciseDto = new ExerciseDTO
        {
            Id = exercise.Id,
            Name = exercise.Name,
            Description = exercise.Description,
            VisualReferenceUrl = exercise.VisualReferenceUrl,
            Sets = exercise.Sets,
            Reps = exercise.Reps

        };

        return exerciseDto;

    }

    public async Task<ExerciseDTO> AddExerciseAsync(ExerciseDTO exerciseDTO)
    {
        Exercise newExercise = new Exercise //Se crea una entidad a partir del dto
        {
            Name = exerciseDTO.Name,
            Description = exerciseDTO.Description,
            VisualReferenceUrl = exerciseDTO.VisualReferenceUrl,
            Sets = exerciseDTO.Sets,
            Reps = exerciseDTO.Reps
            
        };

        Exercise dbExercise = await _repository.CreateExercise(newExercise); //Se pasa a repo layer a crear

        ExerciseDTO dbExerciseDTO = new ExerciseDTO
        {
            Id = dbExercise.Id,
            Name = dbExercise.Name,
            Description = dbExercise.Description,
            VisualReferenceUrl = dbExercise.VisualReferenceUrl,
            Sets = dbExercise.Sets,
            Reps = dbExercise.Reps
        };

        return dbExerciseDTO;
        
    }
}