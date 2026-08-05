using System.IdentityModel.Tokens.Jwt;
using FluentAssertions;
using GYM.Controller.Api.Services;
using GYM.Data.Entities;
using Microsoft.Extensions.Configuration;
using Xunit.Abstractions;

namespace GYM.Tests.Tests.Unit;

public class TokenServiceTests
{
    //Arrange 
    private const string testKey = "YouNeedAtLeast30PlusCharactersToBeSafe";

    public TokenServiceTests(){ }

    //SUT : System Under Test
    public static TokenService CreateSut()
    {
        //Using InMemoryCollection to satisfy the config
         var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
                { ["Jwt:key"] = testKey })
            .Build();

        // Calling TokenService's actual constructor
        return new TokenService(config);
        
    } 

    [Fact]
    public void Issue_ReturnsTokenJWT()
    {
        //Arrange
        var sut = CreateSut();

        //Act
        var token = sut.Issue(1,"unit.test@token.com", Data.Entities.Role.User);
        
        //Assert
        var parsed = new JwtSecurityTokenHandler().ReadJwtToken(token);

            //Fluent Assertions
        parsed.Issuer.Should().Be("GYM-fulfillment");
        parsed.Audiences.Should().Contain("GYM-fulfillment-users");

        Assert.Equal("GYM-fulfillment", parsed.Issuer);
        Assert.Contains("GYM-fulfillment-users", parsed.Audiences);
    }

    [Theory]
    [InlineData(1,"user.test@ut.com",Role.User)]
    [InlineData(2,"trainer.test@ut.com",Role.Trainer)]
    [InlineData(3,"admin.test@ut.com",Role.Admin)]
    public void Issue_IncludeIdEmailRole(int id, string email, Role role)
    {
        //Arrange
        var sut = CreateSut();

        //Act
        var token = sut.Issue(id, email, role);


        //Assert
        var parsed = new JwtSecurityTokenHandler().ReadJwtToken(token);

        parsed.Claims.Should().Contain(c => 
            c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                && c.Value == id.ToString()
            );
        
        parsed.Claims.Should().Contain(c => 
            c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                && c.Value == email
            );
        
        parsed.Claims.Should().Contain(c => 
            c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                && c.Value ==  role.ToString()
            );

    }
}