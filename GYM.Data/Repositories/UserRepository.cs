using GYM.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GYM.Data.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IDbContextFactory<GymDbContext> _factory;
    public UserRepository(IDbContextFactory<GymDbContext> factory)
    {
        _factory = factory;
    }

    //Get the user or null by email 
    public async Task<User?> GetUserByEmail(string email)
    {
        await using var db = await _factory.CreateDbContextAsync();

        return await db.Users.FirstOrDefaultAsync(i => i.Email == email);
    }

    //Get the user or null by Phone 
    public async Task<User?> GetUserByPhone(string phone)
    {
        await using var db = await _factory.CreateDbContextAsync();

        return await db.Users.FirstOrDefaultAsync(i => i.Phone == phone);
    }

    //Add a new user
    public async Task RegisterNewUser(User user)
    {
        await using var db = await _factory.CreateDbContextAsync();

        await db.Users.AddAsync(user);
        await db.SaveChangesAsync();
    }
}