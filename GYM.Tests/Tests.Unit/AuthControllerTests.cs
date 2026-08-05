using Moq;
using GYM.Controller.Api.Services;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using FluentAssertions;
using System.Net;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace GYM.Tests.Tests.Unit;

public class AuthControllerTests
{
    private readonly Mock<IUserService> _userService = new();
    private readonly Mock<ITokenService> _tokenService = new();

    private AuthController CreateSut() => new(_userService.Object, _tokenService.Object);

    //Method_Scenario_ExpectedResult
    [Fact]
    public async Task Login_ValidCredentials_Ok200Token()
    {
        User user = new User
        {
            Id = 1,
            Email = "correct.test@email.com",
            Role = Role.User
        };

        LogInDTO dto = new LogInDTO
        {
            Email = user.Email,
            Password = "1234567890"
        };

        _userService.Setup(r => r.ValidateAsync(dto)).ReturnsAsync(user);
        _tokenService.Setup(r => r.Issue(user.Id, user.Email, user.Role)).Returns("Token Valido");

        AuthController controller = CreateSut();

        var result = await controller.LogIn(dto);
        
        var ok = result.Should()
               .BeOfType<OkObjectResult>()
               .Subject;

        ok.StatusCode.Should().Be(200);

        var token = ok.Value!
                    .GetType()
                    .GetProperty("token")?
                    .GetValue(ok.Value) as string;

        token.Should().Be("Token Valido");
        
    }

        //Method_Scenario_ExpectedResult

    [Theory]
    [InlineData("user@test.com","Wrong-Password")]
    [InlineData("invalid@email.com","1234")]
    public async Task Login_InValidCredentials_401UnAuthorized(string email, string password)
    {
        User user = new User
        {
            Id = 1,
            Email = email,
            Role = Role.User
        };

        LogInDTO dto = new LogInDTO
        {
            Email = user.Email,
            Password = password
        };

        _userService.Setup(r => r.ValidateAsync(dto)).ReturnsAsync((User?)null);

        AuthController controller = CreateSut();

        var result = await controller.LogIn(dto);
        
        result.Should().BeOfType<UnauthorizedObjectResult>();
                      
    }

}