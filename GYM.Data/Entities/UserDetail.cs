using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GYM.Data.Entities;

[Table("UserDetails")]
public class UserDetail
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [Required]
    public Gender Gender { get; set; }

    [Required]
    [StringLength(50)]
    [Column(TypeName = "nvarchar(50)")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    [Column(TypeName = "nvarchar(50)")]
    public string Surname { get; set; } = string.Empty;

    [Column(TypeName = "datetime2")]
    public DateTime JoinAt { get; set; } = DateTime.UtcNow;

    public int Age { get; set; }
}