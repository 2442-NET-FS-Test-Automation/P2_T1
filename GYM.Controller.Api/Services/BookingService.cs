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

        return bookings.Select(e => MapToDTOWithCollections(e)).ToList();
    }

    public async Task<BookingDTO?> GetBookingById(int Id)
    {
        var booking = await _repo.GetBookingById(Id);
        if (booking is null) return null;

        return MapToDTOWithCollections(booking);
    }

    public async Task<IEnumerable<BookingDTO>> GetBookingsByUserId(int userId)
    {
        var bookings = await _repo.GetBookingsByUserId(userId);
        return bookings.Select(booking => MapToDTOWithCollections(booking)).ToList();
    }

    public async Task<BookingDTO> AddBookingAsync(BookingDTO bookingDTO)
    {
        Booking newBooking = new Booking
        {
            TrainingId = bookingDTO.TrainingId,
            UserId = bookingDTO.UserId,
            ExerciseTime = bookingDTO.ExerciseTime ?? DateTime.Now,
            Status = bookingDTO.Status
        };

        Booking dbBooking = await _repo.AddBooking(newBooking);
        return MapToDTOWithCollections(dbBooking);
    }

    public async Task<BookingDTO?> UpdateBooking(BookingDTO bookingDTO)
    {
        Booking? ex = await _repo.GetBookingById(bookingDTO.Id);
        if (ex is null) return null;

        ex.TrainingId = bookingDTO.TrainingId;
        ex.UserId = bookingDTO.UserId;
        ex.ExerciseTime = bookingDTO.ExerciseTime ?? DateTime.Now;
        ex.Status = bookingDTO.Status;

        Booking updatedEx = await _repo.UpdateBooking(ex);
        return MapToDTOWithCollections(updatedEx);
    }

    public Task<bool> DeleteBookingByIdAsync(int BookingId)
    {
        return _repo.RemoveBooking(BookingId);
    }

    public async Task<BookingDTO?> UpdateStatus(int bookingID, int status)
    {
        Booking? booking = await _repo.GetBookingById(bookingID);
        if (booking is null) return null;

        if (booking.Status == BookingStatus.Completed)
            booking.DoneAt = null;

        switch (status)
        {
            case 0: booking.Status = BookingStatus.Booked; break;
            case 1: booking.Status = BookingStatus.Working; break;
            case 2: booking.Status = BookingStatus.Completed; booking.DoneAt = DateTime.UtcNow; break;
            case 3: booking.Status = BookingStatus.Cancelled; break;
            default: return null;
        }

        Booking? updatedBooking = await _repo.UpdateBooking(booking);
        if (updatedBooking is null) return null;

        return MapToDTOWithCollections(updatedBooking);
    }

    /// <summary>
    /// Core Helper Mapping Rule to cleanly project individual structural collections
    /// </summary>
    private BookingDTO MapToDTOWithCollections(Booking booking)
    {
        var dto = new BookingDTO
        {
            Id = booking.Id,
            TrainingId = booking.TrainingId,
            UserId = booking.UserId,
            Status = booking.Status,
            ExerciseTime = booking.ExerciseTime,
            DoneAt = booking.DoneAt,

            // Wraps the single routine instance safely into an array list for your React component loop
            Trainings = booking.Training == null ? new List<TrainingDTO>() : new List<TrainingDTO>
        {
            new TrainingDTO
            {
                Id = booking.Training.Id,
                TrainingName = booking.Training.TrainingName,
                Difficulty = booking.Training.Difficulty,
                Place = booking.Training.Place,
                Calories = booking.Training.Calories,
                Description = booking.Training.Description,
                EstimatedTime = booking.Training.EstimatedTime,
                CreatedAt = booking.Training.CreatedAt,
                
                // Iterates through the junction rows safely to collect exercise data profiles
                Exercises = booking.Training.TrainingExercises?
                    .Where(te => te.Exercise != null)
                    .Select(te => new ExerciseDTO
                    {
                        Id = te.Exercise.Id,
                        Name = te.Exercise.Name,
                        Description = te.Exercise.Description,
                        VisualReferenceUrl = te.Exercise.VisualReferenceUrl,
                        Sets = te.Exercise.Sets,
                        Reps = te.Exercise.Reps
                    }).ToList() ?? new List<ExerciseDTO>()
            }
        },

            // YOUR FIXED USER SECTION MAP:
            Users = booking.User == null ? new List<UserAdminDTO>() : new List<UserAdminDTO>
        {
            new UserAdminDTO
            {
                Id = booking.User.Id,
                Email = booking.User.Email ?? string.Empty,
                Phone = booking.User.Phone ?? string.Empty,
                Role = booking.User.Role.ToString(),
                Name = booking.User.UserDetail?.Name ?? string.Empty,
                Surname = booking.User.UserDetail?.Surname ?? string.Empty,
                JoinAt = booking.User.UserDetail?.JoinAt
            }
        }
        };

        return dto;
    }
}