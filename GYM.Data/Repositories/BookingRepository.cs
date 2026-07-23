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

        return await db.Bookings.FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task<Booking> AddBooking(Booking booking) 
    {
        await using var db = await _factory.CreateDbContextAsync();

        await db.Bookings.AddAsync(booking);
        await db.SaveChangesAsync(); 
        return booking;
    }

    public async Task UpdateAsync(Booking Booking)
    {
        await using var db = await _factory.CreateDbContextAsync();
        db.Entry(Booking).State = EntityState.Modified;
        await db.SaveChangesAsync();
    }

    public async Task<bool> RemoveBooking(int n)
    {
        await using var db = await _factory.CreateDbContextAsync();

        Booking? BookingRemoved = await db.Bookings.FirstOrDefaultAsync(i => i.Id == n);

        if(BookingRemoved is null)
            return false;
        
        db.Bookings.Remove(BookingRemoved);
        await db.SaveChangesAsync();
        return true;
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