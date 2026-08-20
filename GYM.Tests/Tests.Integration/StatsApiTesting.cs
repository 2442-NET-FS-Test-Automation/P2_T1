using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using GYM.Tests.Tests.Integration;

[Collection("Gym API")]
public class StatsApiTest : IClassFixture<GymApiFactory>
{
    private readonly HttpClient _client;

    public StatsApiTest(GymApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    private record TokenResponse(string? token);

    public async Task AuthenticateClientAsync()
    {
        var loginDTO = new
        {
            Email = "user@test.com", 
            Password = "1234"
        };

        var response = await _client.PostAsJsonAsync("/authentication/login", loginDTO);
        response.EnsureSuccessStatusCode();

        // Deserialize the response using TokenResponse record
        var result = await response.Content.ReadFromJsonAsync<TokenResponse>();

        // Adjuntar el token al cliente HttpClient para todas las peticiones siguientes
        _client.DefaultRequestHeaders.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", result?.token);
    }

    //[Fact]
    public async Task GetStats_With200OkStatus()
    {
        await AuthenticateClientAsync();
        // Arrange
        int ExistingId = 1019;

        // Act
        var response = await _client.GetAsync($"/api/Stats/{ExistingId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK); // returns OK 200 of everything was fine
        
        var stats = await response.Content.ReadFromJsonAsync<StatsDTO>();

        stats.Should().NotBeNull();
        stats!.Id.Should().Be(ExistingId);
    }

    // GET - Invalid ID -> Not Found
    [Theory]
    [InlineData(-1)]
    [InlineData(9999)] // Unexisting ID
    public async Task GetTrainings_With404NotFoundStatus(int NotExistingId)
    {
        await AuthenticateClientAsync();

        // Act
        var response = await _client.GetAsync($"/api/Stats/{NotExistingId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateStats_With200OkStatus()
    {
        await AuthenticateClientAsync();

        // Arrange
        StatsDTO dto = new StatsDTO
        {
            Id = 1,
            UserId = 2011,
            Weight = 65m,
            Height = 1.83m,
            Strength = 170m,
            MileRun = new TimeOnly(12, 4),
            MeasureAt = new DateOnly(2026, 2, 4),
            Age = 25
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/Stats", dto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var payload = await response.Content.ReadAsStringAsync();
        payload!.Should().NotBeNullOrWhiteSpace();
    }
    
    [Theory]
    [InlineData(1, 1, -65.0, -183.0, -170.0)]
    public async Task CreateStats_With400BadRequestStatus(int id, int userid, decimal weight, decimal height,
    decimal strength )
    {
        await AuthenticateClientAsync();

        // Arrange
        StatsDTO dto = new StatsDTO {
        Id = id, 
        UserId = userid, 
        Weight = weight, 
        Height = height,
        Strength = strength};

        // Act
        var response = await _client.PostAsJsonAsync("/api/Stats", dto);

        // Assert
         // Bad request
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}

