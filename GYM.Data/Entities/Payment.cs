namespace GYM.Data.Entities;

public class Payment
{
    public int Id {get; set;}
    public int TotalAmount{get; set;} //Payment
    public Status Status {get; set; } //Status of payment
    public DateTime PaymentDate {get; set;} //When was the payment done
    public Booking Booking{get;set;} = default!;
}