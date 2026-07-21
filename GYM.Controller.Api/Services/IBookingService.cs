using GYM.Data.Entities;
using GYM.DTOs;
using Microsoft.AspNetCore.Mvc;
namespace GYM.Services;


public interface IBookingService
{
    public Task<IEnumerable<BookingDto>> GetAllBookingsAsync();

    public Task<BookingDto> GetBookingByIdAsync(int id);

    public Task<Booking> CreateBookingAsync(CreateBookingDto dto);

}