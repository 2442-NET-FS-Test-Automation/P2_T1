using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GYM.Data.Entities;

[Table("Users")]
public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(150)]
    [Column(TypeName = "nvarchar(150)")]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    [Column(TypeName = "varchar(20)")]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    [Column(TypeName = "nvarchar(255)")]
    public string Password { get; set; } = string.Empty;

    [Required]
    public Role Role { get; set; } = Role.User;

    // Relaciones de navegación
    public UserDetail? UserDetail { get; set; }
    public List<Booking> Bookings { get; set; } = new ();
    public List<User_Achievement> UserAchievements { get; set; } = new ();
    public List<Statistic> Statistics { get; set; } = new ();
}