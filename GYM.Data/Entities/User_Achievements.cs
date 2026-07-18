using System.ComponentModel.DataAnnotations;
namespace GYM.Data.Entities;
public class User_Achievements
{
    [Key]
    public int Id {get; set;}
    [Required]
    public int AchievementId {get; set;}
    public Achievements Achievement {get; set;} = default!; // navigation property for achievements
    [Required]
    public int UserId {get; set;}
    public User User {get; set;} = default!; // navigation property for user
    public DateTime Completed_At {get; set;} = DateTime.UtcNow;
}