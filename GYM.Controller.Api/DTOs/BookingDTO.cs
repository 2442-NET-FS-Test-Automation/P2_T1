namespace GYM.Controller.Api.DTOs;

public class BookingDTO{
    public int Id{get;set;}
    public int TrainingId{get;set;}
    public int UserId{get;set;}
    public string Status{get;set;} = default!;
    public DateTime? ExerciseTime{get;set;}
    public DateTime? DoneAt{get;set;}
};

