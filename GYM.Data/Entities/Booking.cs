namespace GYM.Data.Entities;

public class Booking
{
    public int Id {get; set;}
    public int UserId{get; set;} //FK user
    public int PaymentId {get; set;} //FK payment
    public DateTime BookAt{get; set;} //When was the class booked
}