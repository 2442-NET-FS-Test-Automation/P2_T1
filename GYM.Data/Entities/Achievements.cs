using System.ComponentModel.DataAnnotations;
namespace GYM.Data.Entities;
public class Achievements
{
    [Key]
    public int Id {get; set;}
    [Required, MaxLength(100)]
    public string Name {get; set;} = default!;
    [Required] 
    public string Description {get; set;} = default!;
    [MaxLength(100)]
    public string Icon {get; set;} = default!;
    public int Points {get; set;}
    [MaxLength(50)]
    public string Condition_type {get; set;} = default!;
    public int Condition_value {get; set;}
}