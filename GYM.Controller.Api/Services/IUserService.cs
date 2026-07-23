namespace GYM.Controller.Api.Services;

public interface IUserService
{
    Task<string?> RegisterUserAsync(RegisterUserDTOs rUserDTO);
}