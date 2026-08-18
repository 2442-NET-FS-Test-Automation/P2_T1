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

    //Update User Details Tests

        //SUccessfull update, should have used fluent assertions for dtos to ensure data quality

    [Fact]//If UserId is null
    public async Task UpdateUserDetails_NoUserId_Null()
    { //Arrange
        
        UserDetailsDTO dto = new UserDetailsDTO{Gender = Gender.Female, Name = "Dummy Name", Surname = "Dummy Surname"};

        var sut = new UserService(_service.Object, _hasher.Object);
       
       //Act
       var response = await sut.UpdateUserDetails(dto);

       //Assert

       response.Should().BeNull();
    }

    [Fact]//No User with said UserId
    public async Task UpdateUserDetails_NoUserWithUserId_Null()
    { //Arrange
        
        UserDetailsDTO dto = new UserDetailsDTO{UserId = 1, Gender = Gender.Female, Name = "Dummy Name", Surname = "Dummy Surname"};
        var sut = new UserService(_service.Object, _hasher.Object);
       
       //Act
       var response = await sut.UpdateUserDetails(dto);

       //Assert

       response.Should().BeNull();
    }

    [Fact]//No User with said UserId
    public async Task UpdateUserDetails_SucessfullUpdate_UpdatedUserDetailDTO()
    { //Arrange
        DateTime joinAt = DateTime.UtcNow;
        UserDetailsDTO dto = new UserDetailsDTO{Id = 1, UserId = 1, Gender = Gender.Female, Name = "Dummydto Name", Surname = "Dummydto Surname", JoinAt = joinAt};
        UserDetail details = new UserDetail{Id = 1, UserId = 1, Gender = dto.Gender, Name = dto.Name, Surname = dto.Surname, JoinAt = joinAt};
       

        _service.Setup(c => c.GetUserDetailsByUserId(1)).ReturnsAsync(details);
        _service.Setup(c => c.UpdateUserDetails(details)).ReturnsAsync(details);

       var sut = new UserService(_service.Object, _hasher.Object);

       //Act
       var response = await sut.UpdateUserDetails(dto);

       //Assert

       response.Should().BeEquivalentTo(dto);
    }

    //Admin/Trainer can see user    list
    [Fact]
    public async Task GetAllUsersForAdmin_Valid_ListUserAdminDTO()
    {
        //Arrange
        List<User> users = new List<User>();
        
        User user = new User{Id= 1, Email = "user@email.com", Phone = "1234567890", Password = "123456", Role = Role.User};
        User trainer =new User{Id= 2, Email = "trainer@email.com", Phone = "2234567890", Password = "123456", Role = Role.Trainer};
        User admin = new User{Id= 3, Email = "admin@email.com", Phone = "3234567890", Password = "123456", Role = Role.Admin};
        
        users.Add(user);
        users.Add(trainer);
        users.Add(admin);

        _service.Setup(c => c.GetAllUsers()).ReturnsAsync(users);

        UserDetail userD = new UserDetail{Id = 1, UserId = 1, Gender = Gender.Male, Name = "User", Surname = "UTest", JoinAt = DateTime.UtcNow};
        UserDetail trainerD = new UserDetail{Id = 2, UserId = 2, Gender = Gender.Female, Name = "Trainer", Surname = "TTest", JoinAt = DateTime.UtcNow};
        UserDetail adminD = new UserDetail{Id = 3, UserId = 3, Gender = Gender.Male, Name = "Admin", Surname = "ATest", JoinAt = DateTime.UtcNow};

        _service.Setup(c => c.GetUserDetailsByUserId(1)).ReturnsAsync(userD);
        _service.Setup(c => c.GetUserDetailsByUserId(2)).ReturnsAsync(trainerD);
        _service.Setup(c => c.GetUserDetailsByUserId(3)).ReturnsAsync(adminD);

        UserAdminDTO userAdminDTO = new UserAdminDTO{Id = user.Id, Email = user.Email, Phone=user.Phone, Role=user.Role.ToString(), Name=userD.Name, Surname = userD.Surname, JoinAt=userD.JoinAt};
        UserAdminDTO trainerAdminDTO = new UserAdminDTO{Id = trainer.Id, Email = trainer.Email, Phone=trainer.Phone, Role=trainer.Role.ToString(), Name=trainerD.Name, Surname = trainerD.Surname, JoinAt=trainerD.JoinAt};
        UserAdminDTO adminAdminDTO = new UserAdminDTO{Id = admin.Id, Email = admin.Email, Phone=admin.Phone, Role=admin.Role.ToString(), Name=adminD.Name, Surname = adminD.Surname, JoinAt=adminD.JoinAt};
        
        var sut = new UserService(_service.Object, _hasher.Object);

        //Act
        var response = await sut.GetAllUsersForAdmin();

        //Assert
        response.Should().NotBeNull();
        response.Should().HaveCount(3);
        response.Should().ContainEquivalentOf(userAdminDTO);
        response.Should().ContainEquivalentOf(trainerAdminDTO);
        response.Should().ContainEquivalentOf(adminAdminDTO);
    }
}