using GYM.Data.Entities;

namespace GYM.Data.Repositories;

public interface IUserRepository
{
    Task RegisterNewUser(User user);
    Task<User?> GetUserByEmail(string email);
    Task<User?> GetUserByPhone(string phone);
}