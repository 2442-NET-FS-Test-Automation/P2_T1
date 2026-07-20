using System.ComponentModel.DataAnnotations;

namespace GYM.Data.Entities;

public class User
{
    [Key]
    public int Id {get;  set;}
    [Required]
    [EmailAddress]
    public string Email {get; set;} = ""; //Email
    [Required]
    public string Phone{get; set;} = ""; //Phone number
    [Required]
    public string Password {get; set;} = "";
    [Required]
    public Role Role {get; set;} //Role of the user: User or Trainer
    public List<Booking> Bookings  { get; set; } = new();
    public List<Training> Trainigs {get;set;} = new();
    public UserDetail UserDetails  { get; set; } = default!;
    public List<Statistic> Statistics { get; set; }  = new();
    public List<User_Achievement> UserAchievements {get; set;} = new();
}