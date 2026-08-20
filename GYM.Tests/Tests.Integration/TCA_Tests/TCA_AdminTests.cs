using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using GYM.Controller.Api.DTOs;

namespace GYM.Tests.Tests.Integration;

[Collection("GYM API")]
public class TCA_AdminTests
{
    private readonly HttpClient _client;

    public TCA_AdminTests(GymApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    private record TokenResponse(string token);

    private static string login_url = "/authentication/login";

    public enum Role
    {
        Admin,
        Trainer,
        User
    };

    public Role roleType = Role.User;

    //Iniciar sesion como admin para obtener el token y usarlo en las pruebas
    private async Task<HttpClient> LoginAsync(Role role)
    {
        if (role == Role.Admin)
        {
            var login = await _client.PostAsJsonAsync(login_url, new {email = "admin@test.com", password = "1234"});
            var token = (await login.Content.ReadFromJsonAsync<TokenResponse>())!.token;
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            return _client;
        }
        if(role == Role.Trainer)
        {
            var login = await _client.PostAsJsonAsync(login_url, new {email = "trainer@test.com", password = "1234"});
            var token = (await login.Content.ReadFromJsonAsync<TokenResponse>())!.token;
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            return _client;
        }
        else
        {
            var login = await _client.PostAsJsonAsync(login_url, new {email = "user@test.com", password = "1234"});
            var token = (await login.Content.ReadFromJsonAsync<TokenResponse>())!.token;
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            return _client;
        }

    }

    //[Fact]
    public async Task TCA04_AddExercise_ForbiddenRole()
    {
        // Given
        roleType = Role.User;
        var client = await LoginAsync(roleType);
    
        // When
        var response = await client.PostAsJsonAsync("/api/Training/exercises", 
                new ExerciseDTO () {Name = "Test exercise", Description = "Test description", VisualReferenceUrl = "",
                        Sets = 4, Reps = 10});
    
        // Then
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    
    //[Fact]
    public async Task TCA08_DeleteExercise_LinkedToTraining()
    {
        // Given
        roleType = Role.Admin;
        var client = await LoginAsync(roleType);

        var postResponse = await client.PostAsJsonAsync("/api/Training/exercises", 
        new ExerciseDTO () { 
            Name = "Test exercise", 
            Description = "Test description", 
            VisualReferenceUrl = "",
            Sets = 4, 
            Reps = 10
        });

        // Validar que el POST fue exitoso (200 / 201)
        postResponse.EnsureSuccessStatusCode();

        // 2. Deserializar la respuesta para obtener el ID REAL generado por la BD
        var createdExercise = await postResponse.Content.ReadFromJsonAsync<ExerciseDTO>();

        // When - Usar el ID dinámico obtenido
        var response = await client.DeleteAsync($"/api/Training/exercises/{createdExercise!.Id}");

        // Then
        //Se agrego el registro y despues se elimino
        //NoContent = registro eliminado / Resultado: OK
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    //[Fact]
    public async Task TCA09_DeleteExercise_ForbiddenRole()
    {
        // Given
        roleType = Role.User;
        var client = await LoginAsync(roleType);
    
        // When
        var response = await client.DeleteAsync("/api/training/exercises/1");
    
        // Then
        // Here we check that a common user cannot delete exercises (only Admin/Trainer)
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    //[Fact]
    public async Task TCA14_EditExercise_ForbiddenRole()
    {
        // Given
        roleType = Role.User;
        var client = await LoginAsync(roleType);
        var exerciseDTO = new ExerciseDTO
        {
            Id = 1, // ID inexistente
            Name = "Push-Ups", 
            Description = "Perform a standard press.",
            VisualReferenceUrl = "https://media.giphy.com/example.gif",
            Sets = 4,
            Reps = 12
        };
        
    
        // When
        var response = await client.PutAsJsonAsync("/api/Training/exercises", exerciseDTO);
    
        // Then
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    //[Fact]
    public async Task TCA19_AddStaffUser_ForbiddenRole()
    {
        // Given
        roleType = Role.User;
        var client = await LoginAsync(roleType);
        UserCreateAdminDTO newUser = new UserCreateAdminDTO()
        {
            Name = "Alex",
            Surname = "Turner",
            Email = "alex@gymquest.com",
            Phone = "3312345678", //11 digits phone
            Password = "Pass123!",
            Role = "Trainer"
        };
    
        // When
        var _response = await client.PutAsJsonAsync("/api/User/create-staff", newUser);
    
        // Then
        _response.StatusCode.Should().Be(HttpStatusCode.MethodNotAllowed);
    }

    //[Fact]
    public async Task TCA24_ChangeUserRole_ForbiddenRole()
    {
        // Given
        roleType = Role.User;
        var client = await LoginAsync(roleType);
    
        var newRole = Role.Trainer;

        //Act
        var _response = await client.PutAsJsonAsync("/api/User/1/role", newRole);

        //Assert
        _response.StatusCode.Should().Be(HttpStatusCode.MethodNotAllowed);
    }

}