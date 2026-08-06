using Moq;
using GYM.Controller.Api.Services;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using FluentAssertions;
using System.Net;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using GYM.Data.Repositories;

namespace GYM.Tests.Tests.Unit;

public class StatsServiceTests
{
    private readonly Mock<IStatsRepository> _statsService = new();

    [Fact]
    public async Task CreateStatsAsync_WithOk200Status()
    {
        // ARRANGE: We create an entity of domain that returns a simulate repository


        var dto = new StatsDTO
        {
            Id = 1,
            UserId = 1,
            Weight = 78.8m,
            Height = 1.83m,
            Strength = 130m,
            MileRun = new TimeOnly(14,30),
            MeasureAt = new DateOnly(2026, 8 ,6),
            Age = 25
        };

        Statistic dbStats = new Statistic
        {
            Id = 1,
            UserId = 1,
            Weight = 78.8m,
            Height = 1.83m,
            Strength = 130m,
            MileRun = new TimeOnly(14,30),
            MeasureAt = new DateOnly(2026, 8 ,6),
            age = 25
        };

        _statsService
            .Setup(r => r.AddStats(It.IsAny<Statistic>()))
            .ReturnsAsync(dbStats);

        var sut = new StatsService(_statsService.Object);

        // ACT
        var result = await sut.AddStatsAsync(dto);

        // validating all values in stats
        result.Should().NotBeNull();
        result.Should().Be(dbStats.Weight);
        result.Should().Be(dbStats.Height);
        result.Should().Be(dbStats.Strength);
        result.Should().Be(dbStats.age);

        _statsService.Verify(r => r.AddStats(It.IsAny<Statistic>()), Times.Once);
    }

    // testear valores numericos negativos
    [Fact]
    public async Task CreateStatsAsync_WithBad400Status()
    {
        // ARRANGE: We create an entity of domain that returns a simulate repository
        var dto = new StatsDTO
        {
            Id = 1,
            UserId = 1,
            Weight = -78.8m,
            Height = -1.83m,
            Strength = -130m,
            MileRun = new TimeOnly(14,30),
            MeasureAt = new DateOnly(2026, 8 ,6),
            Age = -25
        };

        var sut = new StatsService(_statsService.Object);

        // ACT
        var result = await sut.AddStatsAsync(dto);

        // ASSERT
        result.Should().NotBeNull();

        _statsService.Verify(r => r.AddStats(It.IsAny<Statistic>()), Times.Never);
    }
}