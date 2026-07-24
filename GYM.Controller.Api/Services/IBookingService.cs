using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;

namespace GYM.Controller.Api.Services;



public interface IBookingService
{
    Task<IReadOnlyList<BookingDTO>> GetAllBookings();
    Task<BookingDTO?> GetBookingById(int Id);
    Task<IEnumerable<BookingDTO>> GetBookingsByUserId(int userId);
    Task<BookingDTO> AddBookingAsync(BookingDTO exerciseDTO);
    Task<BookingDTO?> UpdateBooking(BookingDTO bookingDTO);
    Task<bool> DeleteBookingByIdAsync(int BookingId);
    
    // Task<TrainingDTO?> GetTrainingDTOAsync(int id);
    // Task<IReadOnlyList<TrainingDTO>> GetAllTrainings();
    // Task<TrainingDTO?> AddTrainingsToBooking(int trainingId, List<int> Bookings);
    // Task<bool> DeleteTrainingsFromBooking(int trainingId, List<int> Bookings);

}