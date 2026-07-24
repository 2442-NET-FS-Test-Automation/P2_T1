using GYM.Data.Entities;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GYM.Controller.Api.Services;

public class TokenService : ITokenService
{
    private readonly string? _key;

    public TokenService(IConfiguration configuration)
    {
        _key = configuration["Jwt:Key"];
    }
    public string Issue(int id, string email, Role role)
    {
        var creds = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key)),
            SecurityAlgorithms.HmacSha256
        );
        var token = new JwtSecurityToken("GYM-fulfillment","GYM-fulfillment-users",
        new[] {new Claim(ClaimTypes.NameIdentifier, id.ToString()), new Claim(ClaimTypes.Email, email), new Claim(ClaimTypes.Role, role.ToString())},
        expires: DateTime.UtcNow.AddHours(1), signingCredentials:creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}