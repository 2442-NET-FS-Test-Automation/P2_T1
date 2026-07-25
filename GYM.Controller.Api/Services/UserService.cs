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
    public async Task<string?> RegisterTrainerAsync(RegisterUserDTOs rUserDTO)
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
            Role = Role.Trainer 
        };

        user.Password = _hasher.HashPassword(user, rUserDTO.Password);

        await _UserRepository.RegisterNewUser(user);
        return null;
    }

    public async Task<string?> RegisterAdminAsync(RegisterUserDTOs rUserDTO)
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
            Role = Role.Admin 
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

    public async Task<UserDetailsDTO?> GetUserDetails(int userId)
    {
        User? user = await _UserRepository.GetUserById(userId);

        if(user is null)
            return null;
        
        UserDetail? userDetails = await _UserRepository.GetUserDetailsByUserId(user.Id);

        if(userDetails is null)
            return  null;
        
        UserDetailsDTO userDetailsDTO = new UserDetailsDTO
        {
            Id = userDetails.Id,
            UserId = userDetails.UserId,
            Gender = userDetails.Gender,
            Name = userDetails.Name,
            Surname = userDetails.Surname,
            JoinAt = userDetails.JoinAt
        };

        return userDetailsDTO;
    }

    public async Task<UserDetailsDTO?> AddUserDetails(UserDetailsDTO userDetailsDto)
    {
        //Check user with id exist
        if(userDetailsDto.UserId is null)
            return null;

        User? user = await _UserRepository.GetUserById(userDetailsDto.UserId.Value);
        //Create an entity
        if(user is null)
            return null;
        //Send entity

        UserDetail? existUserDetails = await _UserRepository.GetUserDetailsByUserId(user.Id);
        if(existUserDetails is not null)
            return null;

        UserDetail userDetails= new UserDetail
        {
            UserId = userDetailsDto.UserId.Value,
            Gender = userDetailsDto.Gender,
            Name = userDetailsDto.Name,
            Surname = userDetailsDto.Surname,
            JoinAt = userDetailsDto.JoinAt.Value
        };

        UserDetail? NewUserDetails = await _UserRepository.AddUserDetails(userDetails);
        if(NewUserDetails is null)
            return null;
        
        UserDetailsDTO NewUserDetailsDTO = new UserDetailsDTO
        {
            Id = NewUserDetails.Id,
            UserId = NewUserDetails.UserId,
            Name = NewUserDetails.Name,
            Surname = NewUserDetails.Surname,
            JoinAt = NewUserDetails.JoinAt
        };
        return NewUserDetailsDTO;
    }

    public async Task<UserDetailsDTO?> UpdateUserDetails(UserDetailsDTO userDetailsDTO)
    {
        if(userDetailsDTO.UserId is null)
            return null;
        
        UserDetail? userDetail = await _UserRepository.GetUserDetailsByUserId(userDetailsDTO.UserId.Value);

        if(userDetail is null)
            return null;
        
        userDetail.Name = userDetailsDTO.Name;
        userDetail.Surname = userDetailsDTO.Surname;
        userDetail.Gender = userDetailsDTO.Gender;

        UserDetail? UpdatedUserDetail = await _UserRepository.UpdateUserDetails(userDetail);
        if(UpdatedUserDetail is null)
            return null;

        UserDetailsDTO UpdatedUserDetailDTO = new UserDetailsDTO
        {
            Id = UpdatedUserDetail.Id,
            UserId = UpdatedUserDetail.UserId,
            Name = UpdatedUserDetail.Name,
            Surname = UpdatedUserDetail.Surname,
            Gender = UpdatedUserDetail.Gender,
            JoinAt = UpdatedUserDetail.JoinAt
        };

        return UpdatedUserDetailDTO;
    }
}