using GYM.Data.Entities;

namespace GYM.Data.Repositories;

public interface IBookingRepository
{
    Task<IReadOnlyList<Booking>> GetAllBookingsAsync();
    Task<Booking?> GetBookingById(int Id);
    Task<IEnumerable<Booking>> GetBookingsByUserId(int userid);
    Task<Booking> AddBooking(Booking exercise);
    Task<bool> RemoveBooking(int n);

    Task<Booking> UpdateBooking(Booking UpdatedBooking);

    Task<bool> ExistsAsync(int id);
    Task SaveChangesAsync();
}