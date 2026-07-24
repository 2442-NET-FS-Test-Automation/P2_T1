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

    public async Task<UserDetail?> AddUserDetails(UserDetail userDetail)
    {
        await using var db = await _factory.CreateDbContextAsync();
        db.UserDetails.Add(userDetail);
        await db.SaveChangesAsync();
        return await db.UserDetails.FirstOrDefaultAsync(i => i.UserId == userDetail.UserId);
    }

    //Get the user or null by email 
    public async Task<User?> GetUserByEmail(string email)
    {
        await using var db = await _factory.CreateDbContextAsync();

        return await db.Users.FirstOrDefaultAsync(i => i.Email == email);
    }

    public async Task<User?> GetUserById(int UserId)
    {
        await using var db = await _factory.CreateDbContextAsync();
        return await db.Users.FirstOrDefaultAsync(i => i.Id == UserId);
    }

    //Get the user or null by Phone 
    public async Task<User?> GetUserByPhone(string phone)
    {
        await using var db = await _factory.CreateDbContextAsync();

        return await db.Users.FirstOrDefaultAsync(i => i.Phone == phone);
    }

    public async Task<UserDetail?> GetUserDetailsByUserId(int UserId)
    {
        await using var db = await _factory.CreateDbContextAsync();

        return await db.UserDetails.FirstOrDefaultAsync(i => i.UserId == UserId);
    }

    //Add a new user
    public async Task RegisterNewUser(User user)
    {
        await using var db = await _factory.CreateDbContextAsync();

        await db.Users.AddAsync(user);
        await db.SaveChangesAsync();
        
    }

    public async Task<UserDetail?> UpdateUserDetails(UserDetail UserDetail)
    {
        await using var db = await _factory.CreateDbContextAsync();

        db.UserDetails.Update(UserDetail);
        await db.SaveChangesAsync();

        return UserDetail;
    }
}