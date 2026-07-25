using GYM.Controller.Api.DTOs;
using GYM.Data;
using GYM.Data.Entities;
using GYM.Data.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.IdentityModel.Tokens;
using Serilog; //Password Hasher

namespace GYM.Controller.Api.Services;

public class SeederService : ISeederService
{
    private readonly IUserRepository _UserRepository;
    private readonly IPasswordHasher<User> _hasher; //To hash user passwords

    public SeederService(IUserRepository userRepository, IPasswordHasher<User> hasher)
    {
        _UserRepository = userRepository;
        _hasher = hasher;
    }

    public async Task<bool> SeedInfo(List<RegisterUserDTOs> registerUserDTOs)
    {
        
        //Register Users
        List<Role> Roles = new List<Role>{Role.User, Role.Trainer, Role.Admin};
        List<int> UsersId = new();
        for(int i = 0; i < 3; i++)
        {
            User user = new User
            {
                Email = registerUserDTOs[i].Email,
                Phone = registerUserDTOs[i].Phone,
                Role = Roles[i]
            };
            

            user.Password = _hasher.HashPassword(user, registerUserDTOs[i].Password);
            UsersId.Add(await _UserRepository.RegisterNewUserSeeder(user));
        }

        return await _UserRepository.SeedInfo(UsersId);
        
    }
}