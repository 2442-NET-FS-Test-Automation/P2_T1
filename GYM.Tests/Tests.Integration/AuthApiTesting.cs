using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using GYM.Controller.Api.DTOs;

namespace GYM.Tests.Tests.Integration;

[Collection("GYM API")]
public class AuthApiTesting : IClassFixture<GymApiFactory>
{
    private readonly HttpClient _client;

    public AuthApiTesting(GymApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    private record TokenResponse(string? token);

    [Fact]
    public async Task LogIn_WithValidCredentials_ReturnsToken()
    {
        //Arrange
        LogInDTO dto = new LogInDTO {Email = "user@test.com", Password = "1234"}; //User con seeder

        //Act
        var response = await _client.PostAsJsonAsync("/authentication/login", dto);

        //Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK); //Si todo sale bien nos devuelve un Ok - 200
        var payload = await response.Content.ReadFromJsonAsync<TokenResponse>();
        payload!.token.Should().NotBeNullOrWhiteSpace();
    }

    [Theory]
    [InlineData("NonExistingEmail@test.com", "12334567890")]
    [InlineData("user@test.com", "bad-password")]
    public async Task LogIn_WithInvalidCredentials_ReturnsToken(string email, string password)
    {
        //Arrange
        LogInDTO dto = new LogInDTO {Email = email, Password =password};

        //Act
        var response = await _client.PostAsJsonAsync("/authentication/login", dto);

        //Assert
         //Si las credenciales son invalidas nos devuelve un UnAuthorizes - 401
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        var payload = await response.Content.ReadAsStringAsync();
        payload.Should().Contain("Bad credentials");
        
    }
}