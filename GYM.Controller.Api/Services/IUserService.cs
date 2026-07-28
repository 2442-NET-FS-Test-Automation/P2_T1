using GYM.Data.Entities;
using GYM.Controller.Api.DTOs;
namespace GYM.Controller.Api.Services;

public interface IUserService
{
    Task<string?> RegisterUserAsync(RegisterUserDTOs rUserDTO);
    Task<string?> RegisterTrainerAsync(RegisterUserDTOs rUserDTO);
    Task<string?> RegisterAdminAsync(RegisterUserDTOs rUserDTO);
    Task<User?> ValidateAsync(LogInDTO loginDto);
    Task<UserDetailsDTO?> GetUserDetails(int userId);
    Task<UserDetailsDTO?> AddUserDetails(UserDetailsDTO userDetailsDTO);
    Task<UserDetailsDTO?> UpdateUserDetails(UserDetailsDTO userDetailsDTO);
    Task<List<UserAdminDTO>> GetAllUsersForAdmin();
    Task<string?> CreateStaffUserService(UserCreateAdminDTO dto);
    Task<bool> UpdateUserRole(int userId, string newRole);

}