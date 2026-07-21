using GYM.Data.Entities;

namespace GYM.Data.Repositories;

public interface IBookingRepository
{
    public Task<IReadOnlyList<Booking>> GetAllAsync();
    public Task<Booking?> GetByIdAsync(int id);
    public  Task AddAsync(Booking Booking);

    public Task UpdateAsync(Booking Booking);
    public  Task DeleteAsync(Booking Booking);

    public Task<bool> ExistsAsync(int id);
    public Task SaveChangesAsync();
}