using GYM.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GYM.Data.Repositories;

public class BookingRepository : IBookingRepository
{


    private readonly IDbContextFactory<GymDbContext> _factory;


    public BookingRepository(IDbContextFactory<GymDbContext> factory)
    {
        _factory = factory;
    }


    public async Task<IReadOnlyList<Booking>> GetAllBookingsAsync()
    {
        await using var db = await _factory.CreateDbContextAsync();

        return await db.Bookings.ToListAsync();
    }

    public async Task<Booking?> GetBookingById(int id)
    {
        await using var db = await _factory.CreateDbContextAsync();

        return await db.Bookings
            .Include(b => b.Training)
                .ThenInclude(t => t.TrainingExercises)
                    .ThenInclude(te => te.Exercise)
            .Include(b => b.User)
                .ThenInclude(u => u.UserDetail)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<IEnumerable<Booking>> GetBookingsByUserId(int userid)
    {
        await using var db = await _factory.CreateDbContextAsync();

        // FIXED: Removed the incomplete Coach syntax error line entirely
        return await db.Bookings
            .Include(b => b.Training)
                .ThenInclude(t => t.TrainingExercises)
                    .ThenInclude(te => te.Exercise)
            .Include(b => b.User)
                .ThenInclude(u => u.UserDetail) // Synchronized with your specific property name
            .Where(b => b.UserId == userid)
            .ToListAsync();
    }

    public async Task<Booking> AddBooking(Booking booking)
    {
        await using var db = await _factory.CreateDbContextAsync();

        await db.Bookings.AddAsync(booking);
        await db.SaveChangesAsync();

        // Synchronized deep-loading right after row entry insertion
        var fullyLoadedBooking = await db.Bookings
            .Include(b => b.Training)
                .ThenInclude(t => t.TrainingExercises)
                    .ThenInclude(te => te.Exercise)
            .Include(b => b.User)
                .ThenInclude(u => u.UserDetail)
            .FirstOrDefaultAsync(b => b.Id == booking.Id);

        return fullyLoadedBooking ?? booking;
    }

    public async Task<bool> RemoveBooking(int n)
    {
        await using var db = await _factory.CreateDbContextAsync();

        Booking? BookingRemoved = await db.Bookings.FirstOrDefaultAsync(i => i.Id == n);

        if (BookingRemoved is null)
            return false;

        db.Bookings.Remove(BookingRemoved);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<Booking> UpdateBooking(Booking UpdatedBooking)
    {
        await using var db = await _factory.CreateDbContextAsync();
        db.Bookings.Update(UpdatedBooking);
        await db.SaveChangesAsync();
        return UpdatedBooking;
    }
    public async Task<bool> ExistsAsync(int id)
    {
        await using var db = await _factory.CreateDbContextAsync();
        return await db.Bookings.AnyAsync(m => m.Id == id);
    }

    public async Task SaveChangesAsync()
    {

        await Task.CompletedTask;
    }

}