namespace GYM.Data.Entities;

public class Booking
{
    public int Id {get; set;} //PK
    public int TrainingId{get;set;} //FK What training is booked
    public Training Training{get;set;} = default!;
    public int UserId{get; set;} //FK user
    public User User{get;set;} = default!;
    public int PaymentId {get; set;} //FK payment
    public Payment Payment{get;set;} = default!;
    public DateTime BookAt{get; set;} = DateTime.Now; //When was the class booked
}