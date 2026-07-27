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

        if (bookings is null) return null;

        return bookings
            .Select(e => new BookingDTO
            {
                Id = e.Id,
                TrainingId = e.TrainingId,
                UserId = e.UserId,
                Status = e.Status,
                ExerciseTime = e.ExerciseTime,
                DoneAt = e.DoneAt
            })
            .ToList();

    }

    public async Task<BookingDTO?> GetBookingById(int Id)
    {
        var booking = await _repo.GetBookingById(Id);

        if (booking is null)
            return null;

        BookingDTO bookingDto = new BookingDTO
        {
            Id = booking.Id,
            TrainingId = booking.TrainingId,
            UserId = booking.UserId,
            Status = booking.Status,
            ExerciseTime = booking.ExerciseTime,
            DoneAt = booking.DoneAt

        };

        return bookingDto;

    }

    public async Task<IEnumerable<BookingDTO>> GetBookingsByUserId(int userId)
    {
        var bookings = await _repo.GetBookingsByUserId(userId);

        return bookings.Select(booking => new BookingDTO
        {
            Id = booking.Id,
            TrainingId = booking.TrainingId,
            UserId = booking.UserId,
            Status = booking.Status,
            ExerciseTime = booking.ExerciseTime,
            DoneAt = booking.DoneAt
        }).ToList();
    }
    public async Task<BookingDTO> AddBookingAsync(BookingDTO bookingDTO)
    {
        Booking newBooking = new Booking //Se crea una entidad a partir del dto
        {
            TrainingId = bookingDTO.TrainingId,
            UserId = bookingDTO.UserId,
            ExerciseTime = bookingDTO.ExerciseTime ?? DateTime.Now,
            Status = bookingDTO.Status

        };

        Booking dbBooking = await _repo.AddBooking(newBooking); //Se pasa a repo layer a crear

        BookingDTO dbBookingDTO = new BookingDTO
        {
            Id = dbBooking.Id,
            TrainingId = dbBooking.TrainingId,
            UserId = dbBooking.UserId,
            Status = dbBooking.Status,
            ExerciseTime = dbBooking.ExerciseTime,
            DoneAt = dbBooking.DoneAt
        };

        return dbBookingDTO;

    }

    public async Task<BookingDTO?> UpdateBooking(BookingDTO bookingDTO)
    {
        Booking? ex = await _repo.GetBookingById(bookingDTO.Id);

        if (ex is null)
            return null;

        ex.TrainingId = bookingDTO.TrainingId;
        ex.UserId = bookingDTO.UserId;
        ex.ExerciseTime = bookingDTO.ExerciseTime ?? DateTime.Now;
        ex.Status = bookingDTO.Status;

        Booking updatedEx = await _repo.UpdateBooking(ex);

        BookingDTO updatedDTO = new BookingDTO
        {
            Id = updatedEx.Id,
            TrainingId = updatedEx.TrainingId,
            UserId = updatedEx.UserId,
            Status = updatedEx.Status,
            ExerciseTime = updatedEx.ExerciseTime
        };

        return updatedDTO;
    }


    public Task<bool> DeleteBookingByIdAsync(int BookingId)
    {
        return _repo.RemoveBooking(BookingId);
    }

    public async Task<BookingDTO?> UpdateStatus(int bookingID, int status)
    {
        Booking? booking = await _repo.GetBookingById(bookingID);
        if(booking is null) //Check a booking exist with this id
            return null; 

        if(booking.Status == BookingStatus.Completed) //Change the dont at attribute to nothing
            booking.DoneAt = null;

        switch (status) //Change status, and done at
        {
            case 0 : booking.Status = BookingStatus.Booked; break; //Falta quitar el dont at
            case 1 : booking.Status = BookingStatus.Working; break;
            case 2 : booking.Status = BookingStatus.Completed; booking.DoneAt = DateTime.UtcNow; break;
            case 3 : booking.Status = BookingStatus.Cancelled; break;
            default: return null; 
        }

        Booking? updatedBooking = await _repo.UpdateBooking(booking);
        if(updatedBooking is null)
            return null;

        BookingDTO updatedBookingDTO = new BookingDTO
        {
            Id = updatedBooking.Id,
            TrainingId = updatedBooking.TrainingId,
            UserId = updatedBooking.UserId,
            Status = updatedBooking.Status,
            ExerciseTime = updatedBooking.ExerciseTime,
            DoneAt = updatedBooking.DoneAt
        };

        return updatedBookingDTO;

    }
}