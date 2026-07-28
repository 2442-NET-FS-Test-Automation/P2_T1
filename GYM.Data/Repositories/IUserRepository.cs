using GYM.Data.Entities;

namespace GYM.Data.Repositories;

public interface IUserRepository
{
    Task RegisterNewUser(User user);

    Task<int> RegisterNewUserSeeder(User user);
    Task<User?> GetUserByEmail(string email);
    Task<User?> GetUserByPhone(string phone);
    Task<User?> GetUserById(int UserId);
    Task<UserDetail?> GetUserDetailsByUserId(int UserId);
    Task<UserDetail?> AddUserDetails(UserDetail userDetail);
    Task<UserDetail?> UpdateUserDetails(UserDetail UserDetail);
    Task<bool> SeedInfo(List<int> UsersId);
    Task<List<User>> GetAllUsers();
    Task<User?> UpdateUser(User user);
}