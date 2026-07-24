using Azure.Core.Pipeline;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using GYM.Data.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GYM.Controller.Api.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _repo;


    public BookingService(IBookingRepository repo)
    {
        _repo = repo;
    }
   public async Task<IReadOnlyList<BookingDTO>> GetAllBookings()
    {

        var bookings = await _repo.GetAllBookingsAsync();
        
        if(bookings is null) return null;
        
        return bookings
            .Select(e => new BookingDTO
            {
                Id = e.Id,
                TrainingId = e.TrainingId,
                UserId = e.UserId,
                Status = e.Status.ToString(),
                ExerciseTime = e.ExerciseTime,
                DoneAt = e.DoneAt
            })
            .ToList();
        
    }

    public async Task<BookingDTO?> GetBookingById(int Id)
    {
        var booking = await _repo.GetBookingById(Id);

        if(booking is null)
            return null;

        BookingDTO bookingDto = new BookingDTO
        {
            Id = booking.Id,
            TrainingId = booking.TrainingId,
            UserId = booking.UserId,
            Status = booking.Status.ToString(),
            ExerciseTime = booking.ExerciseTime,
            DoneAt = booking.DoneAt

        };

        return bookingDto;

    }

    public async Task<BookingDTO> AddBookingAsync(BookingDTO bookingDTO)
    {
        Booking newBooking = new Booking //Se crea una entidad a partir del dto
        {
            TrainingId = bookingDTO.TrainingId,
            UserId = bookingDTO.UserId,
            ExerciseTime = bookingDTO.ExerciseTime ?? DateTime.Now,
            Status = Enum.TryParse<BookingStatus>(bookingDTO.Status, true, out var parsedStatus) 
            ? parsedStatus 
            : BookingStatus.Book 
            
        };

        Booking dbBooking = await _repo.AddBooking(newBooking); //Se pasa a repo layer a crear

        BookingDTO dbBookingDTO = new BookingDTO
        {
            Id = dbBooking.Id,
            TrainingId = dbBooking.TrainingId,
            UserId = dbBooking.UserId,
            Status = dbBooking.Status.ToString(),
            ExerciseTime = dbBooking.ExerciseTime,
            DoneAt = dbBooking.DoneAt
        };

        return dbBookingDTO;
        
    }

    public Task<bool> DeleteBookingByIdAsync(int BookingId)
    {
        return _repo.RemoveBooking(BookingId);
    }
}