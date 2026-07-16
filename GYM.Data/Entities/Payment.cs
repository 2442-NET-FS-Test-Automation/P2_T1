using System.ComponentModel.DataAnnotations;

namespace GYM.Data.Entities;

public class Payment
{
    [Key]
    public int Id {get; set;}
    [Required]
    public int TotalAmount{get; set;} //Payment
    [Required]
    public Status Status {get; set; } //Status of payment
    [Required]
    public DateTime PaymentDate {get; set;} //When was the payment done
    public Booking Booking{get;set;} = default!;
}