

using System.Security.Claims;
using FluentAssertions;
using GYM.Controller.Api.DTOs;
using GYM.Controller.Api.Services;
using GYM.Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Moq;

namespace GYM.Tests.Tests.Unit;

public class UserControllerTests
{
    private readonly IMemoryCache _cache = new MemoryCache(new MemoryCacheOptions());    
    private readonly Mock<IUserService> _service = new();

    private UserController CreateSut() => new(_cache, _service.Object);

    //Bad request - no dto
    //Bad request return null, bad update
    //Sucessfull update

    [Fact]
    public async Task UpdateUserDetails_WithoutToken_ReturnsUnauthorized()
    {
        // Arrange
        var controller = CreateSut();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity())
            }
        };

        // No configuramos User/Claims

        UserDetailsDTO dto = new UserDetailsDTO
        {
            Id = 1,
            UserId = 1,
            Gender = Gender.Male,
            Name = "New Name",
            Surname = "New Surname",
            JoinAt = DateTime.UtcNow
        };

        // Act
        var result = await controller.UpdateUserDetails(dto);

        // Assert
        result.Result.Should().BeOfType<UnauthorizedResult>();

        _service.Verify(
            x => x.UpdateUserDetails(It.IsAny<UserDetailsDTO>()),
            Times.Never
        );
    }

    [Fact]
    public async Task UpdateUserDetails_Valid_ReturnsOk()
    {
        // Arrange
        var controller = CreateSut();
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "1")
        };

        var identity = new ClaimsIdentity(claims, "TestAuth");

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(identity)
            }
        };

        UserDetailsDTO dto = new UserDetailsDTO
        {
            Id = 1,
            UserId = 1,
            Gender = Gender.Male,
            Name = "New Name",
            Surname = "New Surname",
            JoinAt = DateTime.UtcNow
        };
        _service.Setup(c => c.UpdateUserDetails(dto)).ReturnsAsync(dto);

        // Act
        var result = await controller.UpdateUserDetails(dto);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();

        _service.Verify(
            x => x.UpdateUserDetails(It.IsAny<UserDetailsDTO>()),
            Times.Exactly(1)
        );

    }
}