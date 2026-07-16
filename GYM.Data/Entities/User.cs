using System.ComponentModel.DataAnnotations;

namespace GYM.Data.Entities;

public class User
{
    [Key]
    public int Id {get;  set;}
    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email {get; set;} = ""; //Email
    [Required]
    [MaxLength(20)]
    public string Phone{get; set;} = ""; //Phone number
    [Required]
    [MaxLength(255)]
    public string Password {get; set;} = "";
    [Required]
    public Role Role {get; set;} //Role of the user: User or Trainer
    public List<Booking> Bookings  { get; set; } = new();
    public List<Training> Trainigs {get;set;} = new();
    public UserDetail UserDetails  { get; set; } = default!;
    public List<Statistic> Statistics { get; set; }  = new();

}