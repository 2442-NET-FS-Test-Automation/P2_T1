using Azure.Core.Pipeline;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using GYM.Data.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GYM.Controller.Api.Services;

public class ReportService : IReportService
{
    private readonly IStatsRepository _repo;

    public ReportService(IStatsRepository repo)
    {
        _repo = repo;
    }

    public async Task<UserReportDTO?> GenerateUserReportAsync(int userId)
    {
        // 1. Fetch historical data rows from your repository layer
        var rawStats = await _repo.GetStatsByUserId(userId);
        
        if (rawStats is null || !rawStats.Any())
            return null;

        // 2. Sort the historical tracking metrics sequentially by date
        var sortedStats = rawStats.OrderBy(s => s.MeasureAt).ToList();
        var newest = sortedStats.Last();
        var oldest = sortedStats.First();

        // general mapping to DTO entity
        var mappedHistory = sortedStats.Select(e => new StatsDTO
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

        var top5Strength = mappedHistory
            .OrderByDescending(s => s.Strength)
            .Take(5)
            .ToList();

        var Top5Mile = mappedHistory
            .OrderBy(m => m.MileRun)
            .Take(5)
            .ToList();

        // 3. Compile and map out the data structures safely
        return new UserReportDTO
        {
            UserId = userId,
            TotalMeasurementsTaken = sortedStats.Count,
            AverageWeight = Math.Round(sortedStats.Average(s => s.Weight), 2),
            WeightChange = newest.Weight - oldest.Weight,
            BestMileRun = sortedStats.Min(s => s.MileRun).ToString(@"hh\:mm\:ss"),
            
            History = mappedHistory,
            Top5Strength = top5Strength,
            Top5BestMileRun = Top5Mile
        };
    }
}