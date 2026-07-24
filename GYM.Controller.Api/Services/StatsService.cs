using Azure.Core.Pipeline;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using GYM.Data.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GYM.Controller.Api.Services;

public class StatsService : IStatsService
{
    private readonly IStatsRepository _repo;


    public StatsService(IStatsRepository repo)
    {
        _repo = repo;
    }
    public async Task<IReadOnlyList<StatsDTO>> GetAllStats()
{
    var statsList = await _repo.GetAllStatsAsync();

    if (statsList is null) 
        return Array.Empty<StatsDTO>(); // Return empty collection instead of null

    return statsList
        .Select(e => new StatsDTO
        {
            Id = e.Id,
            UserId = e.UserId,
            Weight = e.Weight,
            Height = e.Height,
            Strength = e.Strength,
            MileRun = e.MileRun,
            MeasureAt = e.MeasureAt,
            Age = e.age
        })
        .ToList()
        .AsReadOnly(); // Safely fulfills IReadOnlyList
}

public async Task<StatsDTO?> GetStatsById(int id)
{
    var stats = await _repo.GetStatsById(id);

    if (stats is null)
        return null;

    return new StatsDTO
    {
        Id = stats.Id,
        UserId = stats.UserId,
        Weight = stats.Weight,
        Height = stats.Height,
        Strength = stats.Strength,
        MileRun = stats.MileRun,
        MeasureAt = stats.MeasureAt,
        Age = stats.age
    };
}

public async Task<IEnumerable<StatsDTO>> GetStatsByUserId(int userId)
{
    var statsList = await _repo.GetStatsByUserId(userId);

    if (statsList is null)
        return Enumerable.Empty<StatsDTO>();

    return statsList.Select(e => new StatsDTO
    {
        Id = e.Id,
        UserId = e.UserId,
        Weight = e.Weight,
        Height = e.Height,
        Strength = e.Strength,
        MileRun = e.MileRun,
        MeasureAt = e.MeasureAt,
        Age = e.age
    }).ToList();
}

public async Task<StatsDTO> AddStatsAsync(StatsDTO statsDTO)
{
    Statistic newStats = new Statistic 
    {
        UserId = statsDTO.UserId,
        Weight = statsDTO.Weight,
        Height = statsDTO.Height,
        Strength = statsDTO.Strength,
        MileRun = statsDTO.MileRun,
        // Default to current date if MeasureAt cannot be mapped directly from a null state
        MeasureAt = statsDTO.MeasureAt == default ? DateOnly.FromDateTime(DateTime.Today) : statsDTO.MeasureAt,
        age = statsDTO.Age
    };

    Statistic dbStats = await _repo.AddStats(newStats); 

    return new StatsDTO
    {
        Id = dbStats.Id,
        UserId = dbStats.UserId,
        Weight = dbStats.Weight,
        Height = dbStats.Height,
        Strength = dbStats.Strength,
        MileRun = dbStats.MileRun,
        MeasureAt = dbStats.MeasureAt,
        Age = dbStats.age
    };
}

public async Task<StatsDTO?> UpdateStats(StatsDTO statsDTO)
{
    Statistic? ex = await _repo.GetStatsById(statsDTO.Id);

    if (ex is null)
        return null;

    ex.UserId = statsDTO.UserId;
    ex.Weight = statsDTO.Weight;
    ex.Height = statsDTO.Height;
    ex.Strength = statsDTO.Strength;
    ex.MileRun = statsDTO.MileRun;
    ex.MeasureAt = statsDTO.MeasureAt;
    ex.age = statsDTO.Age;

    Statistic updatedEx = await _repo.UpdateStats(ex);

    return new StatsDTO
    {
        Id = updatedEx.Id,
        UserId = updatedEx.UserId,
        Weight = updatedEx.Weight,
        Height = updatedEx.Height,
        Strength = updatedEx.Strength,
        MileRun = updatedEx.MileRun,
        MeasureAt = updatedEx.MeasureAt,
        Age = updatedEx.age
    };
}

public Task<bool> DeleteStatsByIdAsync(int statsId)
{
    return _repo.RemoveStats(statsId);
}

}