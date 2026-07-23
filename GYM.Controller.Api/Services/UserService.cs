using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using GYM.Data.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Serilog; //Password Hasher

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
            Phone = userPhone,
            Role = Role.User //all new users are user not trainer
        };

        user.Password = _hasher.HashPassword(user, rUserDTO.Password);

        await _UserRepository.RegisterNewUser(user);
        return null;
    }

    public async Task<User?> ValidateAsync(LogInDTO loginDto)
    {
        string email = loginDto.Email.Trim();
        User? user = await _UserRepository.GetUserByEmail(email);

        if(user is null) //User not found
            return null;
        
        var result = _hasher.VerifyHashedPassword(user, user.Password, loginDto.Password);
        return result == PasswordVerificationResult.Failed ? null : user;

    }
}