

using Azure.Core.Pipeline;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using GYM.Data.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;

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

        Exercise dbExercise = await _repository.AddExercise(newExercise); //Se pasa a repo layer a crear

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

    public async Task<TrainingDTO> AddTrainingAsync(TrainingAddDTO trainingDTO)
    {
        Training training = new Training
        {
            Difficulty = trainingDTO.Difficulty,
            Calories = trainingDTO.Calories,
            Place = trainingDTO.Place,
            Description = trainingDTO.Description,
            EstimatedTime = trainingDTO.EstimatedTime,
            TrainingName = trainingDTO.TrainingName,
            CreatedAt = DateTime.Now
        };

        Training dbNewTrainig = await _repository.AddTraining(training);
        

        TrainingDTO newTraining = new TrainingDTO
        {
            Id = dbNewTrainig.Id,
            Difficulty = dbNewTrainig.Difficulty,
            Calories = dbNewTrainig.Calories,
            Place = dbNewTrainig.Place,
            Description = dbNewTrainig.Description,
            EstimatedTime = dbNewTrainig.EstimatedTime,
            TrainingName = dbNewTrainig.TrainingName
        };

        return newTraining;
    }

    public Task<bool> DeleteExerciseByIdAsync(int ExerciseId)
    {
        return _repository.RemoveExercise(ExerciseId);
    }

    public async Task<TrainingDTO?> GetTrainingDTOAsync(int id)
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
            Place = training.Place,
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

    public async Task<IReadOnlyList<TrainingDTO>> GetAllTrainings()
    {
        var catalog = await _repository.GetAllTrainingsAsync();
        if(catalog is null)
            return null;
        
        List<TrainingDTO> trainingsDTOs = new();
        foreach(Training training in catalog)
        {
            trainingsDTOs.Add(new TrainingDTO
            {
                Id = training.Id,
                TrainingName = training.TrainingName,
                Difficulty = training.Difficulty,
                Calories = training.Calories,
                Place = training.Place,
                Description = training.Description,
                EstimatedTime = training.EstimatedTime,
                CreatedAt = training.CreatedAt,
                Exercises = training.TrainingExercises.Select(te => new ExerciseDTO
                {
                    Id = te.Exercise.Id,
                    Name = te.Exercise.Name,
                    Description = te.Exercise.Description,
                    VisualReferenceUrl = te.Exercise.VisualReferenceUrl,
                    Sets = te.Exercise.Sets,
                    Reps = te.Exercise.Reps
                })
                .ToList()

            });
        }

        return trainingsDTOs;
    }

    public async Task<Training?> AddExercisesToTraining(int trainingId, List<int> Exercises)
    {
        Training? tr = await _repository.GetTrainingById(trainingId);

        List<Exercise> listExercises = new();
        foreach(int num in Exercises)
        {
            Exercise? ex = await _repository.GetExerciseById(num);
            if(ex is null)
                continue;
            listExercises.Add(ex);
        }

        if(listExercises is null || tr is null)
            return null;
            
        Training training = await _repository.AddExercisesToTraining(tr, listExercises);
        return training;
    }

    public async Task<bool> DeleteExercisesFromTraining(int trainingId, List<int> Exercises)
    {
        Training? tr = await _repository.GetTrainingById(trainingId);

        List<Exercise> listExercises = new();
        foreach(int num in Exercises)
        {
            Exercise? ex = await _repository.GetExerciseById(num);
            if(ex is null)
                continue;
            listExercises.Add(ex);
        }

        if(listExercises is null || tr is null)
            return false;
            
        bool result = await _repository.DeleteExercisesFromTraining(tr, listExercises);
        return result;
    }
}