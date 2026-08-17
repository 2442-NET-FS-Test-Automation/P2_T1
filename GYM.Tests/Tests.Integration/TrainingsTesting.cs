using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using GYM.Controller.Api.DTOs;
using GYM.Tests.Tests.Integration;
using GYM.Data.Entities;

[Collection("Gym API")]
public class TrainingsTesting
{
    private readonly HttpClient _client;

    public TrainingsTesting (GymApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    private record TokenResponse(string? token);

    // GET - Do training exists in DB?
    [Fact]
    public async Task GetTrainings_With200OkStatus()
    {
        // Arrange
        int ExistingId = 1;

        // Act
        var response = await _client.GetAsync($"/api/Trainings/trainings/{ExistingId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var training = await response.Content.ReadFromJsonAsync<TrainingDTO>();
        training.Should().NotBeNull();
        training!.Id.Should().Be(ExistingId);
    }

    // GET - Invalid ID -> Not Found
    [Theory]
    [InlineData(-1)]
    [InlineData(9999)] // Unexisting ID
    public async Task GetTrainings_With404NotFoundStatus(int NotExistingId)
    {
        // Act
        var response = await _client.GetAsync($"/api/Trainings/trainings/{NotExistingId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // POST Admin / Trainer Add trainings
    [Fact]
    public async Task CreateTrainings_With201CreatedStatus()
    {
        // Arrange
        TrainingDTO dto = new TrainingDTO 
        {
            Id = 1, 
            TrainingName="Beginner Full Body Workout at GYM", 
            Difficulty="Beginner",
            Place=Place.GYM,
            Calories=65,
            Description="Beginner Full Body Workout at GYM",
            EstimatedTime=new TimeOnly(3,0),
            Exercises = new List<ExerciseDTO>()
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/Trainings/training", dto);

        // Assert
        response.StatusCode.Should().BeOneOf(HttpStatusCode.Created, HttpStatusCode.NoContent); // returns OK 200 of everything was fine
        var payload = await response.Content.ReadFromJsonAsync<TokenResponse>();
        payload!.token.Should().NotBeNullOrWhiteSpace();
    }
    
    // POST Invalid data -> Bad request
    [Theory]
    [InlineData(1, "Beginner Full Body Workout at GYM", "Beginner", Place.GYM, -65, "Beginner Full Body Workout at GYM")]
    public async Task CreateTrainings_With400BadRequestStatus(int id, string trainingname, string difficulty, Place place, int calories, string description)
    {
        // Arrange
        TrainingDTO dto = new TrainingDTO {
            Id = id, 
            TrainingName = trainingname,
            Difficulty = difficulty,
            Place = place,
            Calories = calories,
            Description = description
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/Trainings/trainings", dto);

        // Assert
         //Si las credenciales son invalidas nos devuelve un UnAuthorizes - 401
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var payload = await response.Content.ReadAsStringAsync();
        payload.Should().NotBeNullOrEmpty();
    }

    // Admin / Trainer can edit trainings
    [Theory]
    [InlineData("Intermediate Full Body Workout at GYM", "Intermediate", "Intermediate Full Body Workout at GYM")]
    public async Task EditTrainings_With200OkStatus(string trainingname, string difficulty, string description)
    {
        // Arrange
        TrainingDTO dto = new TrainingDTO {
            TrainingName = trainingname,
            Difficulty = difficulty,
            Description = description
        };

        // Act
        var response = await _client.PatchAsJsonAsync("/api/Trainings/trainings-info", dto);

        // Assert
         //Si las credenciales son invalidas nos devuelve un UnAuthorizes - 401
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var payload = await response.Content.ReadAsStringAsync();
        payload.Should().NotBeNullOrEmpty();
    }

    // DELETE -> Admin / Trainer can DELETE trainings -> 200 Ok Status
    [Fact]
    public async Task DeleteTrainings_With200OkStatus()
    {
        // Arrange
        int ExistingId = 1;

        // Act
        var response = await _client.DeleteAsync($"/api/Trainings/trainings/{ExistingId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK); // 200

        var getResponse = await _client.GetAsync($"/api/Trainings/trainings/{ExistingId}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound); // Checking if it was successfully deleted
    }

    [Fact]
    public async Task DeleteTrainings_With400NotFoundStatus()
    {
        // Arrange
        int NotExistingId = 9999;

        // Act
        var response = await _client.DeleteAsync($"/api/Trainings/trainings/{NotExistingId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}

