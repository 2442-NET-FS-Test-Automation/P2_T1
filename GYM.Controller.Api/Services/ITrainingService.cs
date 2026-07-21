using GYM.Data.Entities;
using GYM.DTOs;
using Microsoft.AspNetCore.Mvc;
namespace GYM.Services;


public interface ITrainingService
{
    public Task<IEnumerable<TrainingDto>> GetAllTrainingsAsync();

    public Task<TrainingDto> GetTrainingByIdAsync(int id);

    public Task<Training> CreateTrainingAsync(CreateTrainingDto dto);

}