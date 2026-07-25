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

    public async Task<int> RegisterNewUserSeeder(User user)
    {
        await using var db = await _factory.CreateDbContextAsync();

        await db.Users.AddAsync(user);
        await db.SaveChangesAsync();

        return user.Id;
    }

    public async Task<bool> SeedInfo(List<int> UsersId)
    {
        using var db = await _factory.CreateDbContextAsync();

        List<string> names = new List<String>{"Stefano", "Carlos", "Miguel"};
        for(int i = 0; i < 3; i++)
        {
            UserDetail userDetails = new UserDetail
            {
                UserId = UsersId[i],
                Gender = Gender.Male,
                Name = names[i],
                Surname = i.ToString(),
                JoinAt = new DateTime(2026, 07, 20)

            };
            db.UserDetails.Add(userDetails);
        }
        //registering bookinfs
        Booking bookingCompleted = new Booking
        {
            TrainingId = 1,
            UserId = UsersId[0],
            Status = BookingStatus.Completed,
            ExerciseTime = new DateTime(2026, 7, 24, 15, 30, 0),
            DoneAt = new DateTime(2026, 7, 24, 16, 30, 0)

        };
        db.Bookings.Add(bookingCompleted);

        Booking bookingBooked = new Booking
        {
            TrainingId = 1,
            UserId = UsersId[0],
            Status = BookingStatus.Book,
            ExerciseTime = new DateTime(2026, 7, 25, 15, 30, 0),
        };
        db.Bookings.Add(bookingBooked);

        Statistic stats1 = new Statistic
        {
            UserId = UsersId[0],
            Weight = 91,
            Height = 1.70M,
            Strength = 45,
            MileRun = new TimeOnly(30),
            MeasureAt = new DateOnly(2026, 7, 1)
        };
        db.Statistics.Add(stats1);

        Statistic stats2 = new Statistic
        {
            UserId = UsersId[0],
            Weight = 90,
            Height = 1.71M,
            Strength = 48,
            MileRun = new TimeOnly(27),
            MeasureAt = new DateOnly(2026, 7, 5)
        };
        db.Statistics.Add(stats2);

        Statistic stats3 = new Statistic
        {
            UserId = UsersId[0],
            Weight = 87,
            Height = 1.71M,
            Strength = 49,
            MileRun = new TimeOnly(27),
            MeasureAt = new DateOnly(2026, 7, 8)
        };
        db.Statistics.Add(stats3);

        Statistic stats4 = new Statistic
        {
            UserId = UsersId[0],
            Weight = 85,
            Height = 1.71M,
            Strength = 51,
            MileRun = new TimeOnly(24),
            MeasureAt = new DateOnly(2026, 7, 15)
        };
        db.Statistics.Add(stats4);

        Statistic stats5 = new Statistic
        {
            UserId = UsersId[0],
            Weight = 84,
            Height = 1.71M,
            Strength = 53,
            MileRun = new TimeOnly(25),
            MeasureAt = new DateOnly(2026, 7, 22)
        };
        db.Statistics.Add(stats5);


        User_Achievement achivement1 = new User_Achievement
        {
            AchievementId = 1,
            UserId = UsersId[0],
            Completed_At = new DateTime(2026, 7, 23)
        };
        db.UserAchievements.Add(achivement1);

        User_Achievement achivement2 = new User_Achievement
        {
            AchievementId = 3,
            UserId = UsersId[0],
            Completed_At = new DateTime(2026, 7, 23)
        };
        db.UserAchievements.Add(achivement2);
        

        await db.SaveChangesAsync();
        return true;
    }

    public async Task<UserDetail?> UpdateUserDetails(UserDetail UserDetail)
    {
        await using var db = await _factory.CreateDbContextAsync();

        db.UserDetails.Update(UserDetail);
        await db.SaveChangesAsync();

        return UserDetail;
    }
}