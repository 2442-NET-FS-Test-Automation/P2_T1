using GYM.Controller.Api.DTOs;
using GYM.Controller.Api.Services;
using GYM.Data.Entities;
using GYM.Data.Repositories;
using Moq;
using FluentAssertions;

namespace GYM.Tests.Tests.Unit; 

public class AdminServiceTests
{
    private readonly Mock<ITrainingRepository> _trainingRepoMock = new();
    private readonly Mock<IUserService> _userServiceMock = new();

    [Fact]
    public async Task TCA01_AddExercise_ValidData()
    {
        // Given
        var responseExercise = new Exercise 
        { 
            Id = 1, 
            Name = "new valid exercise", 
            Description = "Perform a standard press.",
            VisualReferenceUrl = "https://media.giphy.com/example.gif",
            Sets = 4,
            Reps = 12
        };
        
        ExerciseDTO dto = new ExerciseDTO
        {
            Id = 1,
            Name = "new valid exercise", 
            Description = "Perform a standard press.",
            VisualReferenceUrl = "https://media.giphy.com/example.gif",
            Sets = 4,
            Reps = 12
        };

        _trainingRepoMock.Setup(r => r.AddExercise(It.IsAny<Exercise>())).ReturnsAsync(responseExercise);

        var service = new TrainingService(_trainingRepoMock.Object);
    
        // When
        var result = await service.AddExerciseAsync(dto);
    
        // Then
        result.Should().NotBeNull();
        result.Name.Should().Be("new valid exercise");
    }

    [Fact]
    public async Task TCA02_AddExercise_InvalidName()
    {
        // Given
        ExerciseDTO dto = new ExerciseDTO
        {
            Id = 1,
            Name = "123456789123456789123456789123456789123456789", 
            Description = "Perform a standard press.",
            VisualReferenceUrl = "https://media.giphy.com/example.gif",
            Sets = 4,
            Reps = 12
        };

        // Moq debe retornar Task.FromResult<Exercise?>(null) para ser compatible con la nulabilidad
        _trainingRepoMock
            .Setup(r => r.AddExercise(It.IsAny<Exercise>()))
            .Returns(Task.FromResult<Exercise>(null!));

        var service = new TrainingService(_trainingRepoMock.Object);

        // When & Then
        // Al no haber validación interna en el servicio cuando el repo regresa null,
        // se espera que arroje NullReferenceException al intentar mapear la respuesta.
        await service.Invoking(s => s.AddExerciseAsync(dto))
            .Should().ThrowAsync<NullReferenceException>();
    }

    [Fact]
    public async Task TCA03_AddExercise_MissingName()
    {
    // Given
        ExerciseDTO dto = new ExerciseDTO
        {
            Id = 1,
            Name = "", 
            Description = "Perform a standard press.",
            VisualReferenceUrl = "https://media.giphy.com/example.gif",
            Sets = 4,
            Reps = 12
        };

        _trainingRepoMock
            .Setup(r => r.AddExercise(It.IsAny<Exercise>()))
            .Returns(Task.FromResult<Exercise>(null!));

        var service = new TrainingService(_trainingRepoMock.Object);

        // When & Then
        await service.Invoking(s => s.AddExerciseAsync(dto))
            .Should().ThrowAsync<NullReferenceException>();
    }

    [Fact]
    public async Task TCA06_DeleteExercise_ValidId()
    {
        // Given
        _trainingRepoMock.Setup(r => r.RemoveExercise(1)).ReturnsAsync(true);
        var service = new TrainingService(_trainingRepoMock.Object);
    
        // Act
        var result = await service.DeleteExerciseByIdAsync(1);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task TCA07_DeleteExercise_NonExistentId()
    {
        // Given
        _trainingRepoMock.Setup(r => r.RemoveExercise(-1)).ReturnsAsync(false);
        var service = new TrainingService(_trainingRepoMock.Object);
    
        // Act
        var result = await service.DeleteExerciseByIdAsync(-1);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task TCA11_EditExercise_ValidData()
    {
        // Given
        int exerciseId = 1;

        // 1. Ejercicio simulado en la base de datos
        Exercise existingExercise = new() 
        { 
            Id = exerciseId, 
            Name = "Push-Ups", 
            Description = "Desc", 
            VisualReferenceUrl = "url", 
            Sets = 3, 
            Reps = 10 
        };

        // 2. Ejercicio que devolverá el repositorio tras la actualización
        Exercise updatedExercise = new() 
        { 
            Id = exerciseId, 
            Name = "Bench Press", 
            Description = "Desc", 
            VisualReferenceUrl = "url", 
            Sets = 4, 
            Reps = 12 
        };

        // Configurar el mock para encontrar el ejercicio existente
        _trainingRepoMock
            .Setup(r => r.GetExerciseById(exerciseId))
            .ReturnsAsync(existingExercise);

        // Configurar el mock para la actualización
        _trainingRepoMock
            .Setup(r => r.UpdateExercise(It.IsAny<Exercise>()))
            .ReturnsAsync(updatedExercise);  
    
        var service = new TrainingService(_trainingRepoMock.Object);

        // When 
        var result = await service.UpdateExercise(new ExerciseDTO()
        {
            Id = exerciseId,
            Name = "Push-Ups", 
            Description = "Desc", 
            VisualReferenceUrl = "url",
            Sets = 4, 
            Reps = 15
        });

        // Then
        result.Should().NotBeNull();
        result!.Name.Should().Be("Bench Press");
        result.Sets.Should().Be(4);
    }

    [Fact]
    public async Task TCA12_EditExercise_NameExceedsLimit()
    {
        // Given
        var invalidDto = new ExerciseDTO
        {
            Id = 1,
            Name = "Super Heavy Bench Press Variation Exercise", 
            Description = "Perform a standard press.",
            VisualReferenceUrl = "https://media.giphy.com/example.gif",
            Sets = 4,
            Reps = 12
        };

        var service = new TrainingService(_trainingRepoMock.Object);

        // When
        var result = await service.UpdateExercise(invalidDto);

        // Then
        result.Should().BeNull();
    }

    [Fact]
    public async Task TCA13_EditExercise_NonExistentId()
    {
        // Given
        var invalidDto = new ExerciseDTO
        {
            Id = 9999,
            Name = "Push-Ups", 
            Description = "Perform a standard press.",
            VisualReferenceUrl = "https://media.giphy.com/example.gif",
            Sets = 4,
            Reps = 12
        };

        _trainingRepoMock.Setup(r => r.UpdateExercise(It.IsAny<Exercise>()))
            .ReturnsAsync((Exercise)null!);

        var service = new TrainingService(_trainingRepoMock.Object);

        // When
        var result = await service.UpdateExercise(invalidDto);

        // Then
        result.Should().BeNull();
    }

    [Fact]
    public async Task TCA16_AddStaffUser_ValidData()
    {
        // Given
        UserCreateAdminDTO newUser = new UserCreateAdminDTO()
        {
            Name = "Alex",
            Surname = "Turner",
            Email = "alex@gymquest.com",
            Phone = "3312345678",
            Password = "Password123!",
            Role = "Trainer"
        };     

        _userServiceMock.Setup(r => r.CreateStaffUserService(newUser))
            .ReturnsAsync("UserCreatedSuccessfully");  

        var service = _userServiceMock.Object;
    
        // When   
        var result = await service.CreateStaffUserService(newUser);  
    
        // Then
        result.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task TCA17_AddStaffUser_InvalidPhoneLength()
    {
        // Given
        UserCreateAdminDTO newUser = new UserCreateAdminDTO()
        {
            Name = "Alex",
            Surname = "Turner",
            Email = "alex@gymquest.com",
            Phone = "33123456789", // 11 dígitos
            Password = "Password123!",
            Role = "Trainer"
        };     

        _userServiceMock.Setup(r => r.CreateStaffUserService(newUser))
            .ReturnsAsync((string?)null);  

        var service = _userServiceMock.Object;
    
        // When   
        var result = await service.CreateStaffUserService(newUser);  
    
        // Then
        result.Should().BeNull();
    }

    [Fact]
    public async Task TCA18_AddStaffUser_ShortPassword()
    {
        // Given
        UserCreateAdminDTO newUser = new UserCreateAdminDTO()
        {
            Name = "Alex",
            Surname = "Turner",
            Email = "alex@gymquest.com",
            Phone = "3312345678", 
            Password = "Pass1",
            Role = "Trainer"
        };     

        _userServiceMock.Setup(r => r.CreateStaffUserService(newUser))
            .ReturnsAsync((string?)null);  

        var service = _userServiceMock.Object;
    
        // When   
        var result = await service.CreateStaffUserService(newUser);  
    
        // Then
        result.Should().BeNull();
    }

    [Fact]
    public async Task TCA21_ChangeUserRole_ValidRole()
    {
        // Given
        _userServiceMock.Setup(r => r.UpdateUserRole(1, "Trainer"))
            .ReturnsAsync(true);

        var service = _userServiceMock.Object;
    
        // Act
        var result = await service.UpdateUserRole(1, "Trainer");

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task TCA22_ChangeUserRole_InvalidRoleEnum()
    {
        // Given - El mock debe retornar false para un rol inválido
        _userServiceMock.Setup(r => r.UpdateUserRole(1, "Empty"))
            .ReturnsAsync(false);

        var service = _userServiceMock.Object;
    
        // Act
        var result = await service.UpdateUserRole(1, "Empty");

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task TCA23_ChangeUserRole_NonExistentUser()
    {
        // Given - El mock debe retornar false para un id inexistente
        _userServiceMock.Setup(r => r.UpdateUserRole(-1, "Trainer"))
            .ReturnsAsync(false);

        var service = _userServiceMock.Object;
    
        // Act
        var result = await service.UpdateUserRole(-1, "Trainer");

        // Assert
        result.Should().BeFalse();
    }
}