using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GYM.Data.Entities;

[Table("Trainings")]
public class Training
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Difficulty { get; set; } = string.Empty;

    public int Calories { get; set; }

    [Required]
    public Place Place { get; set; }

    [StringLength(255)]
    [Column(TypeName = "varchar(255)")]
    public string Description { get; set; } = string.Empty;

    public TimeOnly EstimatedTime { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    [StringLength(120)]
    [Column(TypeName = "varchar(120)")]
    public string TrainingName { get; set; } = string.Empty;

    // Relaciones de navegación
    public List<TrainingExercises> TrainingExercises { get; set; } = new ();
    public List<Booking> Bookings { get; set; } = new ();
}