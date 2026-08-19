using System.Net.Http.Json;
using GYM.Controller.Api.DTOs;
using FluentAssertions;
using System.Net;
using System.Net.Http.Headers;
using Serilog;

namespace GYM.Tests.Tests.Integration;

[Collection("GYM API")]
public class AchivementTesting 
{
    private readonly HttpClient _client;

    public AchivementTesting(GymApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    private record TokenResponse(string? token);

    [Fact]
    public async Task GetAchievementsByUserId_ValidCredentials_listAchivementDTOs()
    {
        //Arrange
        //Crear usuario

        //crear achivement

        //Desbloquear el achivement para el usuario

        //Login as a normal user
        LogInDTO dto = new LogInDTO {Email = "user@test.com", Password = "1234"}; //User con seeder
        var loginResponse = await _client.PostAsJsonAsync("/authentication/login", dto);

        loginResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var login = await loginResponse.Content
            .ReadFromJsonAsync<TokenResponse>();

        // Usar el JWT obtenido
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                login!.token);
        

        // Intentar acceder al endpoint de Admin
        var response = await _client.DeleteAsync("/api/Training/exercises/1");

        // Está autenticado, pero no tiene permisos
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);

    }

    
}