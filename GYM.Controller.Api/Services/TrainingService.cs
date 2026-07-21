

using Azure.Core.Pipeline;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using GYM.Data.Repositories;

namespace GYM.Controller.Api.Services;

//Repo Layer
public class TrainingService : ITrainingService
{ 
    private readonly ITrainingRepository _repository;

    public TrainingService(ITrainingRepository repository)
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

    public async Task<ExerciseDTO?> GetExerciseById(int Id)
    {
        var exercise = await _repository.GetExerciseById(Id);

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

    public Task<bool> DeleteExerciseByIdAsync(int ExerciseId)
    {
        return _repository.RemoveExercise(ExerciseId);
    }

    public async Task<TrainingDTO> GetTrainingDTOAsync(int id)
    {
        var training = await _repository.GetTrainingById(id);

        if(training is null)
            return null;
        
        List<ExerciseDTO> exercises = new();
        TrainingDTO trainingDTO = new TrainingDTO
        {
            Id = training.Id,
            TrainingName = training.TrainingName,
            Difficulty = training.Difficulty,
            Calories = training.Calories,
            Description = training.Description,
            EstimatedTime = training.EstimatedTime,
            CreatedAt = training.CreatedAt,
            Exercises = training.TrainingExercises //Pass as a list of exercisesDTO
                .Select(te => new ExerciseDTO
                {
                    Id = te.Exercise.Id,
                    Name = te.Exercise.Name,
                    Description = te.Exercise.Description,
                    VisualReferenceUrl = te.Exercise.VisualReferenceUrl,
                    Sets = te.Exercise.Sets,
                    Reps = te.Exercise.Reps
                })
                .ToList()
        };
        return trainingDTO;
    }

    public Task<TrainingDTO> AddTrainingAsync(TrainingDTO training)
    {
        throw new NotImplementedException();
    }
}