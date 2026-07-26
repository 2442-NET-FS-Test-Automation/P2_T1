using GYM.Data.Entities;

namespace GYM.Controller.Api.DTOs;

public class BookingDTO{
    public int Id {get;set;}
    public int TrainingId {get;set;}
    public int UserId {get;set;}
    public BookingStatus Status { get; set; } = BookingStatus.Booked;
    public DateTime? ExerciseTime {get;set;} 
    public DateTime? DoneAt {get;set;} 
};

