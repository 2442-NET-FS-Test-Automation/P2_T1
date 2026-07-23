using GYM.Data.Entities;
using GYM.Controller.Api.DTOs;
namespace GYM.Controller.Api.Services;

public interface IUserService
{
    Task<string?> RegisterUserAsync(RegisterUserDTOs rUserDTO);
    Task<User?> ValidateAsync(LogInDTO loginDto);
}