using GYM.Controller.Api.DTOs;
using GYM.Controller.Api.Services;
using GYM.Data.Entities;
using GYM.Data.Repositories;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Identity;
using Moq;
using FluentAssertions;

namespace GYM.Tests.Tests.Unit;

public class UserServiceTests
{
    //Mok UserRepository so we dont hit the db
    private readonly Mock<IUserRepository> _service = new();
    private readonly Mock<IPasswordHasher<User>> _hasher = new();

    

    [Fact] //Test para verificar si la logica de login funciona con credenciales validas
    public async Task ValidateAsync_MockUserRepository_GoodCredentials()
    {
        User user = new();
        user.Id = 1;
        user.Email= "user.test@ut.com";
        user.Phone = "1234567890";
        user.Password="1234";
        user.Role= Role.User;

        _service.Setup(r => r.GetUserByEmail("user.test@ut.com")).ReturnsAsync(user);
        _hasher.Setup(r => r.VerifyHashedPassword(user, "1234", "1234")).Returns(PasswordVerificationResult.Success);

        var sut = new UserService(_service.Object, _hasher.Object);

        LogInDTO dto = new LogInDTO
        {
            Email = user.Email,
            Password = "1234"
        };

        var result = await sut.ValidateAsync(dto);

        result.Should().Be(user);
    }

     [Fact] //Test para verificar si la logica de login falla con credenciales invalidas
    public async Task ValidateAsync_MockUserRepository_BadCredentials()
    {
        User user = new();
        user.Id = 1;
        user.Email= "user.test@ut.com";
        user.Phone = "1234567890";
        user.Password="1234";
        user.Role= Role.User;

        LogInDTO dto = new LogInDTO
        {
            Email = user.Email,
            Password = "wrong-password"
        };

        _service.Setup(r => r.GetUserByEmail(user.Email)).ReturnsAsync(user);
        _hasher.Setup(r => r.VerifyHashedPassword(user, user.Password, dto.Password)).Returns(PasswordVerificationResult.Failed);

        var sut = new UserService(_service.Object, _hasher.Object);

        var result = await sut.ValidateAsync(dto);

        result.Should().Be(null);
    }

    [Fact] //Method_Scenario_ExpectedResult
    public async Task RegisterUserAsync_ValidCredentials_UserCreated()
    {
        _service.Setup(r => r.GetUserByEmail(It.IsAny<string>())).ReturnsAsync((User?)null);
        _service.Setup(r => r.GetUserByPhone(It.IsAny<string>())).ReturnsAsync((User?)null);
        
        RegisterUserDTOs dto = new RegisterUserDTOs
        {
            Email = "user@test.com",
            Phone = "1234567890",
            Password = "1234",
        };

        var sut = new UserService(_service.Object, _hasher.Object);

        var result = await sut.RegisterUserAsync(dto);
        result.Should().BeNull();

    }
    
    [Fact] //Method_Scenario_ExpectedResult
    public async Task RegisterUserAsync_RepitedEmail_ErrorMesssage()
    {
        User user = new();
        user.Email= "ser@test.com";
        user.Phone = "1234567890";

        _service.Setup(r => r.GetUserByEmail(It.IsAny<string>())).ReturnsAsync(user);
        _service.Setup(r => r.GetUserByPhone(It.IsAny<string>())).ReturnsAsync((User?)null);
        
        RegisterUserDTOs dto = new RegisterUserDTOs
        {
            Email = "user@test.com",
            Phone = "1234567890",
            Password = "1234",
        };

        var sut = new UserService(_service.Object, _hasher.Object);

        var result = await sut.RegisterUserAsync(dto);
        result.Should().Be("Email already in use");

    }

    [Fact] //Method_Scenario_ExpectedResult
    public async Task RegisterUserAsync_RepitedPhone_ErrorMesssage()
    {
        User user = new();
        user.Id = 1;
        user.Email= "user.test@ut.com";
        user.Phone = "1234567890";
        user.Password="1234";
        user.Role= Role.User;

        _service.Setup(r => r.GetUserByEmail(It.IsAny<string>())).ReturnsAsync((User?)null);
        _service.Setup(r => r.GetUserByPhone(It.IsAny<string>())).ReturnsAsync(user);
        
        RegisterUserDTOs dto = new RegisterUserDTOs
        {
            Email = "user@test.com",
            Phone = "1234567890",
            Password = "1234",
        };

        var sut = new UserService(_service.Object, _hasher.Object);

        var result = await sut.RegisterUserAsync(dto);
        result.Should().Be("Phone already in use");

    }
}