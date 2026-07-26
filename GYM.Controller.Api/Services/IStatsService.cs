using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;

namespace GYM.Controller.Api.Services;



public interface IStatsService
{
    Task<IReadOnlyList<StatsDTO>> GetAllStats();
    Task<StatsDTO?> GetStatsById(int Id);
    Task<IEnumerable<StatsDTO>> GetStatsByUserId(int userId);
    Task<StatsDTO> AddStatsAsync(StatsDTO exerciseDTO);
    Task<StatsDTO?> UpdateStats(StatsDTO bookingDTO);
    Task<bool> DeleteStatsByIdAsync(int StatsId);
    
    // Task<TrainingDTO?> GetTrainingDTOAsync(int id);
    // Task<IReadOnlyList<TrainingDTO>> GetAllTrainings();
    // Task<TrainingDTO?> AddTrainingsToStats(int trainingId, List<int> Statss);
    // Task<bool> DeleteTrainingsFromStats(int trainingId, List<int> Statss);

}