using FluentAssertions;
using GYM.Data.Repositories;
using GYM.Controller.Api.DTOs;
using GYM.Controller.Api.Services;

using Moq;
using GYM.Data.Entities;

namespace GYM.Tests.Tests.Unit;
public class AchivementsTests
{
    private readonly Mock<IAchievementRepository> _achivementRepo = new();

    [Fact]
    public async Task GetAllAchievements_WithListOfAchivements_ReturnsListAchivements()
    {
        //Arrange
        //Creacion de un dummy achivement
        Achievement ach = new Achievement{Id = 1, Name="Test achivement", Description = "Dummy to be used in testing", Icon = "No icon",
            Points = 1, Condition_type = "No Condition", ConditionValue = 1};
        List<Achievement> list = new();
        list.Add(ach);

        AchievementDTO achDTO = new AchievementDTO{Id = 1, Name="Test achivement", Description = "Dummy to be used in testing", Icon = "No icon",
            Points = 1, Condition_type = "No Condition", ConditionValue = 1};

        //Poner un return de una lista con 1 achivement
        _achivementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(list);
        var sut = new AchievementService(_achivementRepo.Object);

        //Act
        var result = await sut.GetAllAchievements();

        //Assert
        result.Should().NotBeNullOrEmpty();
        result.Should().HaveCount(1);
        result.Should().ContainEquivalentOf(achDTO);
    }

        [Fact]
    public async Task GetAllAchievements_WithListOfAchivements_ReturnsEmptyListAchivements()
    {
        //Arrange
        
        //Poner un return de una lista con 1 achivement
        _achivementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(new List<Achievement>());
        var sut = new AchievementService(_achivementRepo.Object);

        //Act
        var result = await sut.GetAllAchievements();

        //Assert
        result.Should().BeNullOrEmpty();
    }

    [Fact] //Metodo_Escenario_ResultadoEsperado
    public async Task GetAchievementsByUserId_UserWithAchivements_IEnumerableAchievementDTO()
    {
        //Arrange
        Achievement ach1 = new Achievement{Id = 1, Name="Test achivement 1", Description = "Dummy to be used in testing", Icon = "No icon",
            Points = 1, Condition_type = "No Condition", ConditionValue = 1};
        Achievement ach2 = new Achievement{Id = 2, Name="Test achivement 2", Description = "Dummy to be used in testing", Icon = "No icon",
            Points = 2, Condition_type = "No Condition", ConditionValue = 2};

        List<Achievement> list = new();
        list.Add(ach1);
        list.Add(ach2);

        DateTime fecha = DateTime.UtcNow;
        AchievementDTO achDTO1 = new AchievementDTO{Id = 1, Name="Test achivement 1", Description = "Dummy to be used in testing", Icon = "No icon",
            Points = 1, Condition_type = "No Condition", ConditionValue = 1, CompletedAt = fecha};
        AchievementDTO achDTO2 = new AchievementDTO{Id = 2, Name="Test achivement 2", Description = "Dummy to be used in testing", Icon = "No icon",
            Points = 2, Condition_type = "No Condition", ConditionValue = 2, CompletedAt = fecha};

        

        _achivementRepo.Setup(r => r.GetAchievementsByUserId(1)).ReturnsAsync(list);
        _achivementRepo.Setup(r => r.GetCompletedAtByUserArchivementID(1, 1)).ReturnsAsync(fecha);
        _achivementRepo.Setup(r => r.GetCompletedAtByUserArchivementID(2, 1)).ReturnsAsync(fecha);
        //Act

        var sut = new AchievementService(_achivementRepo.Object);
        var response = await sut.GetAchievementsByUserId(1);

        //Assert
        response.Should().NotBeNull();
        response.Should().HaveCount(2);
        response.Should().ContainEquivalentOf(achDTO1);
        response.Should().ContainEquivalentOf(achDTO2);
    }

}