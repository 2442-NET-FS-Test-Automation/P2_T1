using System.Net.Http.Json;
using GYM.Controller.Api.DTOs;
using FluentAssertions;
using System.Net;
using System.Net.Http.Headers;
using Serilog;

namespace GYM.Tests.Tests.Integration;

[Collection("GYM API")]
public class RolesTesting 
{
    private readonly HttpClient _client;

    public RolesTesting(GymApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    private record TokenResponse(string? token);

    //[Fact]
    public async Task LogInUser_TrainerControllerBlocked_Unauthorized()
    {
        //Arrange
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

    //[Fact]
    public async Task LogInTrainer_AdmminControllerBlocked_Unanthorized()
    {
        LogInDTO dto = new LogInDTO{Email = "trainer@test.com", Password = "1234"};
        var loginResponse = await _client.PostAsJsonAsync("/authentication/login", dto);

        loginResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var login = await loginResponse.Content
            .ReadFromJsonAsync<TokenResponse>();

        // Usar el JWT obtenido
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                login!.token);     


        UserCreateAdminDTO userDto = new UserCreateAdminDTO{Name = "test", Surname = "tester", Email= "Dummy@email.com", Phone = "0987654321", Password="Password123", Role = "Admin"};
   
    
         // Intentar acceder al endpoint de Admin
        var response = await _client.PostAsJsonAsync("/api/User/create-staff", userDto);

        // Está autenticado, pero no tiene permisos
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}