using GYM.Data.Entities;

namespace GYM.Data.Repositories;

public interface IUserRepository
{
    Task RegisterNewUser(User user);
    Task<User?> GetUserByEmail(string email);
    Task<User?> GetUserByPhone(string phone);
    Task<User?> GetUserById(int UserId);
    Task<UserDetail?> GetUserDetailsByUserId(int UserId);
    Task<UserDetail?> AddUserDetails(UserDetail userDetail);
    Task<UserDetail?> UpdateUserDetails(UserDetail UserDetail);
}