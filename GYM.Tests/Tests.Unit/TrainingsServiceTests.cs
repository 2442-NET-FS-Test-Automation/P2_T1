using Moq;
using GYM.Controller.Api.Services;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using FluentAssertions;
using GYM.Data.Repositories;

namespace GYM.Tests.Tests.Unit;

public class TraningServiceTests
{
    private readonly Mock<ITrainingRepository> _trainingRepoMock = new();
    private readonly Mock<IExerciseRepository> _exerciseRepoMock = new(); // Si tu servicio valida ejercicios

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
            ExercisesIDs = new List<int> { 1 }
        };

        var exercise = new Exercise
        {
            Id = 1,
            Name = "Push-Ups",
            Description = "Basic push-up",
            VisualReferenceUrl = "https://example.com/pushup.gif",
            Sets = 4,
            Reps = 15
        };

        var dbTraining = new Training
        {
            Id = 1,
            TrainingName = dto.TrainingName,
            Difficulty = dto.Difficulty,
            Place = dto.Place,
            Calories = dto.Calories,
            Description = dto.Description,
            EstimatedTime = dto.EstimatedTime,
            TrainingExercises = new List<TrainingExercises>
            {
                new TrainingExercises
                {
                    TrainingId = 1,
                    ExerciseId = 1,
                    Exercise = exercise
                }
            }
        };

        _trainingRepoMock
            .Setup(t => t.AddTraining(It.IsAny<Training>()))
            .ReturnsAsync(dbTraining);

        _trainingRepoMock
            .Setup(t => t.GetExerciseById(1))
            .ReturnsAsync(exercise);

        _trainingRepoMock
            .Setup(t => t.AddExercisesToTraining(It.IsAny<Training>(), It.IsAny<List<Exercise>>()))
            .ReturnsAsync(dbTraining);

        _trainingRepoMock
            .Setup(t => t.GetTrainingById(1))
            .ReturnsAsync(dbTraining);

        var sut = new TrainingService(_trainingRepoMock.Object);

        // ACT
        var result = await sut.AddTrainingAsync(dto);

        // ASSERT
        result.Should().NotBeNull();
        result!.Difficulty.Should().Be(dto.Difficulty);
        result.Place.Should().Be(dto.Place);
        result.Calories.Should().Be(dto.Calories);
        result.Description.Should().Be(dto.Description);
        result.Exercises.Should().ContainSingle();

        _trainingRepoMock.Verify(t => t.AddTraining(It.IsAny<Training>()), Times.Once);
        _trainingRepoMock.Verify(t => t.GetExerciseById(1), Times.Once);
    }

    [Fact]
    public async Task CreateTrainingAsync_WithNoExercises_ReturnsNull()
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
            ExercisesIDs = new List<int>()
        };

        var dbTraining = new Training
        {
            Id = 1,
            TrainingName = dto.TrainingName,
            Difficulty = dto.Difficulty,
            Place = dto.Place,
            Calories = dto.Calories,
            Description = dto.Description,
            EstimatedTime = dto.EstimatedTime
        };

        _trainingRepoMock
            .Setup(t => t.AddTraining(It.IsAny<Training>()))
            .ReturnsAsync(dbTraining);

        var sut = new TrainingService(_trainingRepoMock.Object);

        // ACT
        var result = await sut.AddTrainingAsync(dto);

        // ASSERT
        result.Should().BeNull();
        _trainingRepoMock.Verify(t => t.AddTraining(It.IsAny<Training>()), Times.Once);
        _trainingRepoMock.Verify(t => t.GetExerciseById(It.IsAny<int>()), Times.Never);
    }
}