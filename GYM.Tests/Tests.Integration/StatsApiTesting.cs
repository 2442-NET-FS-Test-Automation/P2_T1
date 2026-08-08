using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using GYM.Controller.Api.DTOs;
using GYM.Tests.Tests.Integration;

public class StatsApiTest
{
    private readonly HttpClient _client;

    public StatsApiTest(GymApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    private record TokenResponse(string? token);

    [Fact]
    public async Task CreateStats_With200OkStatus()
    {
        // Arrange
        StatsDTO dto = new StatsDTO {Id = 1, UserId = 1, Weight = 65m, Height = 183m, 
            Strength = 170m, MileRun = new TimeOnly(12, 4), 
            MeasureAt = new DateOnly(2026, 2, 4), Age=25};

        // Act
        var response = await _client.PostAsJsonAsync("/api/Stats", dto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK); // returns OK 200 of everything was fine
        var payload = await response.Content.ReadFromJsonAsync<TokenResponse>();
        payload!.token.Should().NotBeNullOrWhiteSpace();
    }
    
    [Theory]
    [InlineData(1, 1, -65.0, -183.0, -170.0)]
    public async Task CreateStats_With400BadRequestStatus(int id, int userid, decimal weight, decimal height,
    decimal strength )
    {
        // Arrange
        // StatsDTO dto = new StatsDTO {Id = 1, UserId = 1, Weight = 65m, Height = 183m, 
        //     Strength = 170m, MileRun = new TimeOnly(12, 4), 
        //     MeasureAt = new DateOnly(2026, 2, 4), Age=25};

        StatsDTO dto = new StatsDTO {Id = id, UserId = userid, Weight = weight, Height = height,
        Strength = strength};

        // Act
        var response = await _client.PostAsJsonAsync("/api/Stats", dto);


        // Assert
         //Si las credenciales son invalidas nos devuelve un UnAuthorizes - 401
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var payload = await response.Content.ReadAsStringAsync();
        payload.Should().Contain("Bad credentials");
    }
}

