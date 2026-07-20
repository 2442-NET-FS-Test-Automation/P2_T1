using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GYM.Data.Entities;

[Table("TrainingExercises")]
public class TrainingExercises
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int TrainingId { get; set; }

    [ForeignKey(nameof(TrainingId))]
    public Training Training { get; set; } = null!;

    [Required]
    public int ExerciseId { get; set; }

    [ForeignKey(nameof(ExerciseId))]
    public Exercise Exercise { get; set; } = null!;
}