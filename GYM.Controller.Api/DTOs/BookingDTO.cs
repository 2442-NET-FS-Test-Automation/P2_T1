using GYM.Data.Entities;

namespace GYM.Controller.Api.DTOs;

public class BookingDTO{
    public int Id;
    public int TrainingId;
    public int UserId;
    public BookingStatus Status { get; set; } = BookingStatus.Booked;
    public DateTime? ExerciseTime;
    public DateTime? DoneAt;
};

