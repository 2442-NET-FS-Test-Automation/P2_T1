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


    public async Task<IReadOnlyList<Booking>> GetAllAsync()
    {
        await using var db = await _factory.CreateDbContextAsync();

        return await db.Bookings
            .Include(m => m.Inventory)
            .ToListAsync();
    }

    public async Task<Booking?> GetByIdAsync(int id)
    {
        await using var db = await _factory.CreateDbContextAsync();

        return await db.Bookings
            .Include(m => m.Inventory)
            .FirstOrDefaultAsync(m => m.BookingID == id);
    }

    public async Task AddAsync(Booking Booking) 
    {
        await using var db = await _factory.CreateDbContextAsync();

        await db.Bookings.AddAsync(Booking);
        await db.SaveChangesAsync(); 
    }

    public async Task UpdateAsync(Booking Booking)
    {
        await using var db = await _factory.CreateDbContextAsync();
        db.Entry(Booking).State = EntityState.Modified;
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Booking Booking)
    {
        await using var db = await _factory.CreateDbContextAsync();
        db.Bookings.Remove(Booking);
        await db.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(int id)
    {
        await using var db = await _factory.CreateDbContextAsync();
        return await db.Bookings.AnyAsync(m => m.BookingID == id);
    }

    public async Task SaveChangesAsync()
    {

        await Task.CompletedTask;
    }

}