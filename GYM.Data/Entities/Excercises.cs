using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GYM.Data.Entities;

[Table("Exercises")]
public class Exercise
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(30)]
    [Column(TypeName = "varchar(30)")]
    public string Name { get; set; } = string.Empty;

    [StringLength(255)]
    [Column(TypeName = "varchar(255)")]
    public string Description { get; set; } = string.Empty;

    [StringLength(255)]
    [Column(TypeName = "varchar(255)")]
    public string VisualReferenceUrl { get; set; } = string.Empty;

    public int Sets { get; set; }

    public int Reps { get; set; }

    // Relación de navegación
    public List<TrainingExercises> TrainingExercises { get; set; } = new ();
}