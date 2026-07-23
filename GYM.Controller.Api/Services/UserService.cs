using GYM.Data.Entities;
using GYM.Data.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens; //Password Hasher

namespace GYM.Controller.Api.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _UserRepository;
    private readonly IPasswordHasher<User> _hasher; //To hash user passwords

    public UserService(IUserRepository userRepository, IPasswordHasher<User> hasher)
    {
        _UserRepository = userRepository;
        _hasher = hasher;
    }
    public async Task<string?> RegisterUserAsync(RegisterUserDTOs rUserDTO)
    {
        string userEmail = rUserDTO.Email.Trim();
        User? userEmailX = await _UserRepository.GetUserByEmail(userEmail);
        string userPhone = rUserDTO.Phone.Trim();
        User? userPhoneX = await _UserRepository.GetUserByPhone(userPhone);

        if(userEmailX is not null)
            return "Email already in use";
        else if(userPhoneX is not null)
            return "Phone already in use";
        
        User user = new User
        {
            Email = userEmail,
            Phone = userPhone
        };

        user.Password = _hasher.HashPassword(user, rUserDTO.Password);

        await _UserRepository.RegisterNewUser(user);
        return null;
    }
}