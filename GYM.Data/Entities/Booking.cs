using System.ComponentModel.DataAnnotations;
namespace GYM.Data.Entities;

public class Booking
{
    [Key]
    public int Id {get; set;} //PK
    [Required]
    public int TrainingId{get;set;} //FK What training is booked
    public Training Training{get;set;} = default!;
    [Required]
    public int UserId{get; set;} //FK user
    public User User{get;set;} = default!;
    [Required]
    public int PaymentId {get; set;} //FK payment
    public Payment Payment{get;set;} = default!;
    [Required]
    public DateTime BookAt{get; set;} = DateTime.Now; //When was the class booked
}