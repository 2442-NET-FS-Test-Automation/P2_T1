using Moq;
using GYM.Controller.Api.Services;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Caching.Memory;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace GYM.Tests.Tests.Unit;

public class AchivementControllerTests
{
    private readonly IMemoryCache _cache = new MemoryCache(new MemoryCacheOptions());    private readonly Mock<IAchievementService> _achivementService = new();

    private AchievementController CreateSut() => new(_achivementService.Object, _cache);
    [Fact]
    public async Task GetAllAchievements_NullReturn_NotFound()
    {
        //Arrange

        _achivementService.Setup(r => r.GetAllAchievements()).ReturnsAsync(new List<AchievementDTO>());

        //Act
        AchievementController controller = CreateSut();
        ActionResult<IEnumerable<AchievementDTO>> result = await controller.GetAllAchievements();

        //Assert

        result.Value.Should().BeNullOrEmpty();
    }

    [Fact]
    public async Task GetAllAchievements_listAchivementsDTO_Ok()
    {
        //Arrange
        DateTime fecha = DateTime.UtcNow;
        AchievementDTO achDTO1 = new AchievementDTO{Id = 1, Name="Test achivement 1", Description = "Dummy to be used in testing", Icon = "No icon",
            Points = 1, Condition_type = "No Condition", ConditionValue = 1, CompletedAt = fecha};
        AchievementDTO achDTO2 = new AchievementDTO{Id = 2, Name="Test achivement 2", Description = "Dummy to be used in testing", Icon = "No icon",
            Points = 2, Condition_type = "No Condition", ConditionValue = 2, CompletedAt = fecha};
        
        List<AchievementDTO> list = new();
        list.Add(achDTO1);
        list.Add(achDTO2);

        _achivementService.Setup(r => r.GetAllAchievements()).ReturnsAsync(list);

        //Act
        AchievementController controller = CreateSut();
        ActionResult<IEnumerable<AchievementDTO>> result = await controller.GetAllAchievements();

        //Assert
        result.Result.Should().BeOfType<OkObjectResult>();

        var okResult = result.Result as OkObjectResult; //resut is action result 200 ok

        var achievements = okResult!.Value
            .Should()
            .BeAssignableTo<IEnumerable<AchievementDTO>>() 
            .Subject;

        achievements.Should().NotBeNullOrEmpty(); //Not empty

        achievements.Should().BeEquivalentTo(list); //gets the list that we send

    }

    [Fact]
    public async Task GetAchievementsByUserId_User1_OkAchivementsDTO()
    {
        //arrange
        int userId = 1;
        List<AchievementDTO> list = new List<AchievementDTO>
        {
            new AchievementDTO{Id = 1, Name="Test achivement 1", Description = "Dummy to be used in testing", Icon = "No icon",
                Points = 1, Condition_type = "No Condition", ConditionValue = 1, CompletedAt = DateTime.UtcNow},
            new AchievementDTO{Id = 2, Name="Test achivement 2", Description = "Dummy to be used in testing", Icon = "No icon",
                Points = 2, Condition_type = "No Condition", ConditionValue = 2, CompletedAt = DateTime.UtcNow}
        };

        _achivementService.Setup(r => r.GetAchievementsByUserId(userId)).ReturnsAsync(list);
        var controller = CreateSut();

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        };
        var identity = new ClaimsIdentity(claims,  "TestAchivement");

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(identity)
            }
        };

        //Act
        var result = await controller.GetAchievementsByUserId();

        //Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    
        var okResult = result.Result as OkObjectResult;

        var achievements = okResult!.Value
        .Should()
        .BeAssignableTo<IEnumerable<AchievementDTO>>()
        .Subject;

        achievements.Should().NotBeNullOrEmpty();

        achievements.Should().BeEquivalentTo(list);

        _achivementService.Verify(
            x => x.GetAchievementsByUserId(userId),
            Times.Once);

    }

    [Fact]
    public async Task GetAchievementsByUserId_User1_NoContent()
    {
        //arrange
        int userId = 1;
        
        var controller = CreateSut();

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        };
        var identity = new ClaimsIdentity(claims,  "TestAchivement");

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(identity)
            }
        };

        //Act
        var result = await controller.GetAchievementsByUserId();

        //Assert
        result.Result.Should().BeOfType<NoContentResult>();
    
        var okResult = result.Result as NoContentResult;
        
        _achivementService.Verify(
            x => x.GetAchievementsByUserId(userId),
            Times.Once);

    }
}