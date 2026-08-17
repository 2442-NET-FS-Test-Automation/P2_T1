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

public class TraningServiceTests
{
    private readonly Mock<ITrainingRepository> _trainingService = new();

    [Fact]
    public async Task CreateTraningAsync_With200OkStatus()
    {
        // ARRANGE

        var dto = new TrainingAddDTO
        {
          TrainingName = "Beginner Fullbody workout",
          Difficulty = "Beginner",
          Place = Place.GYM,
          Calories = 65,
          Description = "Beginner Fullbody workout at GYM",
          EstimatedTime = new TimeOnly(4, 50),
        };

        Training dbTraining = new Training
        {
            TrainingName = dto.TrainingName,
            Difficulty = dto.Difficulty,
            Place = dto.Place,
            Calories = dto.Calories,
            Description = dto.Description,
            EstimatedTime = dto.EstimatedTime,
        };

        _trainingService
            .Setup(t => t.AddTraining(It.IsAny<Training>()))
            .ReturnsAsync(dbTraining);

        var sut = new TrainingService(_trainingService.Object);

        // ACT
        var result = await sut.AddTrainingAsync(dto);

        // ASSERT
        result.Should().NotBeNull();
        result.Difficulty.Should().Be(dto.Difficulty);
        result.Place.Should().Be(dto.Place);
        result.Calories.Should().Be(dto.Calories);
        result.Description.Should().Be(dto.Description);

        _trainingService.Verify(t => t.AddTraining(It.IsAny<Training>()), Times.Once);
    }

    // Invalid, negative calories
    [Fact]
    public async Task CreateTrainingAsync_WithBad400Status()
    {
        // ARRANGE
        var dto = new TrainingAddDTO
        {
            TrainingName = "Beginner Fullbody workout",
            Difficulty = "Beginner",
            Place = Place.GYM,
            Calories = -65,
            Description = "Beginner Fullbody workout at GYM",
            EstimatedTime = new TimeOnly(4, 50),
        };

        var sut = new TrainingService(_trainingService.Object);

        // ACT
        Func<Task> result = async() => await sut.AddTrainingAsync(dto);

        // ASSERT
        await result.Should().ThrowAsync<ArgumentException>();

        // Verifying that it never was stored in database
        _trainingService.Verify(t => t.AddTraining(It.IsAny<Training>()), Times.Never);
    }
}